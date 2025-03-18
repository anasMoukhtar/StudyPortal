document.addEventListener("DOMContentLoaded", () => {
  // Retrieve tasks from localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Display statistics in the overview page
  document.getElementById("total-tasks").textContent = totalTasks;
  document.getElementById("completed-tasks").textContent = completedTasks;
  document.getElementById("pending-tasks").textContent = pendingTasks;

  // Create a doughnut chart using Chart.js
  const ctx = document.getElementById("tasksChart").getContext("2d");
  const tasksChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#4caf50", "#f44336"],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#e3e3e3",
          },
        },
      },
    },
  });
});
