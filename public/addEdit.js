import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showExercises } from "./exercises.js";

let addEditDiv = null;
let exercise = null;
let sets = null;
let reps = null;
let measurement = null;
let measurementUnit = null;
let addingExercise = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-exercise");
  exercise = document.getElementById("exercise");
  sets = document.getElementById("sets");
  reps = document.getElementById("reps");
  measurement = document.getElementById("measurement");
  measurementUnit = document.getElementById("measurementUnit");
  addingExercise = document.getElementById("adding-exercise");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingExercise) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/exercises";

        if (addingExercise.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/exercises/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: exercise.value,
              sets: sets.value,
              reps: reps.value,
              measurement: measurement.value,
              measurementUnit: measurementUnit.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The exercise entry was updated.";
            } else {
              // a 201 is expected for a successful create
              message.textContent = "The exercise entry was created.";
            }

            exercise.value = "";
            sets.value = "";
            reps.value = "";
            measurement.value = "";
            measurementUnit.value = "";
            showExercises();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showExercises();
      }
    }
  });
};

export const showAddEdit = async (exerciseId) => {
  if (!exerciseId) {
    exercise.value = "";
    sets.value = "";
    reps.value = "";
    measurement.value = "";
    measurementUnit.value = "";
    addingExercise.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/exercises/${exerciseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        exercise.value = data.exercise.name;
        sets.value = data.exercise.sets;
        reps.value = data.exercise.reps;
        measurement.value = data.exercise.measurement;
        measurementUnit.value = data.exercise.measurementUnit;
        addingExercise.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = exerciseId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The exercise entry was not found";
        showExercises();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showExercises();
    }

    enableInput(true);
  }
};
