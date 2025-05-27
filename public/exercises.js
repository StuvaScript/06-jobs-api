import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { deleteExercise } from "./delete.js";

let exercisesDiv = null;
let exercisesTable = null;
let exercisesTableHeader = null;

export const handleExercises = () => {
  exercisesDiv = document.getElementById("exercises");
  const logoff = document.getElementById("logoff");
  const addExercise = document.getElementById("add-exercise");
  exercisesTable = document.getElementById("exercises-table");
  exercisesTableHeader = document.getElementById("exercises-table-header");

  exercisesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addExercise) {
        showAddEdit(null);
      } else if (e.target.classList.contains("deleteButton")) {
        deleteExercise(e.target.dataset.id);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        exercisesTable.replaceChildren([exercisesTableHeader]);

        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      }
    }
  });
};

export const showExercises = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/exercises", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [exercisesTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        exercisesTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.exercises.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.exercises[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.exercises[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.exercises[i].name}</td>
            <td>${data.exercises[i].sets}</td>
            <td>${data.exercises[i].reps}</td>
            <td>${data.exercises[i].measurement}</td>
            <td>${data.exercises[i].measurementUnit}</td>
            ${editButton}
            ${deleteButton}`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        exercisesTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(exercisesDiv);
};
