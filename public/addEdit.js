import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;

// !!  **`` Error is below ``**
export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-job");
  exercise = document.getElementById("exercise");
  sets = document.getElementById("sets");
  reps = document.getElementById("reps");
  measurement = document.getElementById("measurement");
  measurementUnit = document.getElementById("measurementUnit");
  addingJob = document.getElementById("adding-job");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingJob) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/exercises";
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              company: company.value,
              position: position.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 201) {
            // 201 indicates a successful create
            message.textContent = "The job entry was created.";
            exercise.value = "";
            sets.value = "";
            reps.value = "";
            measurement.value = "";
            measurementUnit.value = "";

            showJobs();
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
        showJobs();
      }
    }
  });
};

export const showAddEdit = async (jobId) => {
  if (!jobId) {
    exercise.value = "";
    sets.value = "";
    reps.value = "";
    measurement.value = "";
    measurementUnit.value = "";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        exercise.value = data.job.name;
        sets.value = data.job.sets;
        reps.value = data.job.reps;
        measurement.value = data.job.measurement;
        measurementUnit.value = data.job.measurementUnit;
        addingJob.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = jobId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The jobs entry was not found";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};
