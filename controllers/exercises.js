const getAllExercises = async (req, res) => {
  res.send("get all exercises");
};

const getExercise = async (req, res) => {
  res.send("get exercise");
};

const createExercise = async (req, res) => {
  res.send("create exercise");
};

const updateExercise = async (req, res) => {
  res.send("update exercise");
};

const deleteExercise = async (req, res) => {
  res.send("delete exercise");
};

module.exports = {
  getAllExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
};
