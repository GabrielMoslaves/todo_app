const taskModel = require("../models/taskModel");

async function getTasks(_, res) {
  try {
    const result = await taskModel.getTasks();
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
}
async function getTaskById(req, res) {
  try {
    const result = await taskModel.getTaskById(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function createTask(req, res) {
  try {
    const result = await taskModel.createTask(req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function updateTask(req, res) {
  try {
    const result = await taskModel.updateTask(req.params.id, req.body);
    res.json(result);
  } catch (e) {
    res.status(500).message({ e });
  }
}

async function deleteTask(req, res) {
  try {
    const result = await taskModel.deleteTaskById(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

const taskController = {
  getTasks,
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
};

module.exports = taskController;
