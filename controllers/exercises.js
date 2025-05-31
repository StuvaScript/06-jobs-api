const Exercise = require("../models/Exercise");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllExercises = async (req, res) => {
  const exercises = await Exercise.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ exercises, count: exercises.length });
};

const getExercise = async (req, res) => {
  const {
    user: { userId },
    params: { id: exerciseId },
  } = req;

  const exercise = await Exercise.findOne({
    _id: exerciseId,
    createdBy: userId,
  });

  if (!exercise) {
    throw new NotFoundError(`No exercise with id ${exerciseId}`);
  }

  res.status(StatusCodes.OK).json({ exercise });
};

const createExercise = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const exercise = await Exercise.create(req.body);
  res.status(StatusCodes.CREATED).json({ exercise });
};

const updateExercise = async (req, res) => {
  const {
    body: { name, measurement, measurementUnit },
    user: { userId },
    params: { id: exerciseId },
  } = req;

  if (name === "" || measurement === "" || measurementUnit === "") {
    throw new BadRequestError("Fields cannot be empty");
  }

  const exercise = await Exercise.findByIdAndUpdate(
    { _id: exerciseId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!exercise) {
    throw new NotFoundError(`No exercise with id ${exerciseId}`);
  }

  res.status(StatusCodes.OK).json({ exercise });
};

const deleteExercise = async (req, res) => {
  const {
    user: { userId },
    params: { id: exerciseId },
  } = req;

  const exercise = await Exercise.findByIdAndRemove({
    _id: exerciseId,
    createdBy: userId,
  });

  if (!exercise) {
    throw new NotFoundError(`No exercise with id ${exerciseId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
};
