import { enableInput, message, token } from "./index.js";
import { showJobs } from "./jobs.js";
export const deleteExercise = async (id) => {
  enableInput(false);

  try {
    const response = await fetch(`/api/v1/exercises/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      message.textContent = "Exercise successfully deleted";
      showJobs();
    } else {
      message.textContent = data.msg;
    }

    enableInput(true);
  } catch (err) {
    console.log(err);
    message.textContent = "A communications error has occurred.";
    showJobs();
  }
};
