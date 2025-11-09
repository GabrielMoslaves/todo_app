import taskModel from "../models/taskModel.js";

async function getTasks(req, res) {
  try {
    const result = await taskModel.getTasks(req.user.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
async function getTaskById(req, res) {
  try {
    const result = await taskModel.getTaskById(req.params.id, req.user.id);
    if (!result) {
      res.status(404).json({ message: "Tarefa não encontrada" });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function createTask(req, res) {
  try {
    const taskData = {
      ...req.body,
      user_id: req.user.id,
    };
    const result = await taskModel.createTask(taskData);

    if (!result) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function updateTask(req, res) {
  try {
    const taskData = {
      user_id: req.user.id,
    };

    if (req.body.name !== undefined) {
      taskData.name = req.body.name;
    }
    if (req.body.status !== undefined) {
      taskData.status = req.body.status;
    }
    if (req.body.duration !== undefined) {
      taskData.duration = req.body.duration;
    }
    if (req.body.start_time !== undefined) {
      taskData.start_time = new Date(req.body.start_time);
    }

    const result = await taskModel.updateTask(req.params.id, taskData);

    if (!result) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deleteTask(req, res) {
  try {
    const result = await taskModel.deleteTaskById(req.params.id, req.user.id);

    if (!result) {
      return res.status(404).json({
        message: "Tarefa não encontrada",
      });
    }

    res.json({
      message: "Tarefa deletada com sucesso",
      deletedTask: result,
    });
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

export default taskController;
