const express = require("express");
const {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

module.exports = router;
