import userModel from "../models/usersModel.js";

async function getUsers(req, res) {
  try {
    const result = await userModel.getUsers();
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function createUser(req, res) {
  try {
    const result = await userModel.createUser(req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function updateUser(req, res) {
  try {
    const result = await userModel.updateUser(req.body, req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function deleteUser(req, res) {
  try {
    const result = await userModel.deleteUser(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

const userController = { getUsers, createUser, deleteUser, updateUser };

export default userController;
