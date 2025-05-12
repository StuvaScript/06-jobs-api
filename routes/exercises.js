const express = require("express");
const router = express.Router();

const {
  getAllExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercises");

router.route("/").post(createExercise).get(getAllExercises);
router
  .route("/:id")
  .get(getExercise)
  .delete(deleteExercise)
  .patch(updateExercise);

module.exports = router;
