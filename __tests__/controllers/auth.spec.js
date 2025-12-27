import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("../../models/authModel.js");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

import authController from "../../controllers/authController.js";
import authModel from "../../models/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as uuidModule from "uuid";

const { login, refresh, logout } = authController;

process.env.JWT_SECRET = "test-secret-key";

describe("AuthController", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    authModel.getUserByUserEmail = jest.fn();
    authModel.createRefreshToken = jest.fn();
    authModel.getRefreshToken = jest.fn();
    authModel.deleteRefreshToken = jest.fn();
    jwt.sign = jest.fn();
    bcrypt.compare = jest.fn();

    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("login", () => {
    it("deve fazer login com sucesso quando usuário e senha são válidos", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };
      const mockAccessToken = "mock-access-token";
      const mockRefreshToken = "mock-refresh-token";

      req.body = {
        email: "test@example.com",
        password: "correctPassword",
      };

      authModel.getUserByUserEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockAccessToken);
      uuidModule.v4.mockReturnValue(mockRefreshToken);
      authModel.createRefreshToken.mockResolvedValue({});

      await login(req, res);

      expect(authModel.getUserByUserEmail).toHaveBeenCalledWith(req.body);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "correctPassword",
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, "test-secret-key", {
        expiresIn: "3m",
      });
      expect(uuidModule.v4).toHaveBeenCalled();
      expect(authModel.createRefreshToken).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });

    it("deve retornar 401 quando usuário não é encontrado", async () => {
      req.body = {
        email: "nonexistent@example.com",
        password: "anyPassword",
      };

      authModel.getUserByUserEmail.mockResolvedValue(null);

      await login(req, res);

      expect(authModel.getUserByUserEmail).toHaveBeenCalledWith(req.body);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuário não encontrado",
      });
    });

    it("deve retornar 401 quando senha está incorreta", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };

      req.body = {
        email: "test@example.com",
        password: "wrongPassword",
      };

      authModel.getUserByUserEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(authModel.getUserByUserEmail).toHaveBeenCalledWith(req.body);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongPassword",
        "hashedPassword"
      );
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Senha incorreta",
      });
    });

    it("deve retornar 500 quando ocorre uma exceção durante o login", async () => {
      req.body = {
        email: "test@example.com",
        password: "anyPassword",
      };

      const mockError = new Error("Database error");
      authModel.getUserByUserEmail.mockRejectedValue(mockError);

      await login(req, res);

      expect(authModel.getUserByUserEmail).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro no login",
        error: "Database error",
      });
    });
  });

  describe("refresh", () => {
    it("deve gerar novo access token com refresh token válido", async () => {
      const mockRefreshToken = "valid-refresh-token";
      const mockNewAccessToken = "new-access-token";
      const mockUserId = 1;

      req.body = {
        refresh_token: mockRefreshToken,
      };

      authModel.getRefreshToken.mockResolvedValue({
        rowCount: 1,
        rows: [{ user_id: mockUserId }],
      });
      jwt.sign.mockReturnValue(mockNewAccessToken);

      await refresh(req, res);

      expect(authModel.getRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUserId },
        "test-secret-key",
        { expiresIn: "15d" }
      );
      expect(res.json).toHaveBeenCalledWith({
        accessToken: mockNewAccessToken,
      });
    });

    it("deve retornar 401 quando refresh token é inválido ou inexistente", async () => {
      const mockRefreshToken = "invalid-refresh-token";

      req.body = {
        refresh_token: mockRefreshToken,
      };

      authModel.getRefreshToken.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      await refresh(req, res);

      expect(authModel.getRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid refresh token",
      });
    });

    it("deve retornar 500 quando ocorre uma exceção durante o refresh", async () => {
      const mockRefreshToken = "any-refresh-token";

      req.body = {
        refresh_token: mockRefreshToken,
      };

      const mockError = new Error("Database error");
      authModel.getRefreshToken.mockRejectedValue(mockError);

      await refresh(req, res);

      expect(authModel.getRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  describe("logout", () => {
    it("deve fazer logout com sucesso quando refresh token é deletado", async () => {
      const mockRefreshToken = "valid-refresh-token";

      req.body = {
        refresh_token: mockRefreshToken,
      };

      authModel.deleteRefreshToken.mockResolvedValue({
        rowCount: 1,
        rows: [{ token: mockRefreshToken }],
      });

      await logout(req, res);

      expect(authModel.deleteRefreshToken).toHaveBeenCalledWith(
        mockRefreshToken
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "logout successful",
      });
    });

    it("deve retornar 400 quando token não é encontrado", async () => {
      const mockRefreshToken = "nonexistent-refresh-token";

      req.body = {
        refresh_token: mockRefreshToken,
      };

      authModel.deleteRefreshToken.mockResolvedValue(null);

      await logout(req, res);

      expect(authModel.deleteRefreshToken).toHaveBeenCalledWith(
        mockRefreshToken
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("deve retornar 500 quando ocorre uma exceção durante o logout", async () => {
      const mockRefreshToken = "any-refresh-token";

      req.body = {
        refresh_token: mockRefreshToken,
      };

      const mockError = new Error("Database error");
      authModel.deleteRefreshToken.mockRejectedValue(mockError);

      await logout(req, res);

      expect(authModel.deleteRefreshToken).toHaveBeenCalledWith(
        mockRefreshToken
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });
});
