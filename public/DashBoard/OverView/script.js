  document.addEventListener("DOMContentLoaded", function () {
    // Sample data for task completion
    const taskData = {
      labels: ["Completed", "In Progress", "Not Started"],
      datasets: [
        {
          label: "Tasks",
          data: [12, 5, 3], // Example data
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
          borderColor: ["#4CAF50", "#FFC107", "#F44336"],
          borderWidth: 1,
        },
      ],
    };

    // Chart configuration
    const config = {
      type: "bar",
      data: taskData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#243747",
            },
            ticks: {
              color: "#fff",
            },
          },
          x: {
            grid: {
              color: "#243747",
            },
            ticks: {
              color: "#fff",
            },
          },
        },
      },
    };

    // Render the chart
    const taskChart = new Chart(document.getElementById("taskChart"), config);
  });
  // pie chart 
  document.addEventListener("DOMContentLoaded", function () {
    // Sample data for task distribution
    const taskDistributionData = {
      labels: ["Work", "Study", "Personal"],
      datasets: [
        {
          label: "Tasks",
          data: [8, 6, 4], // Example data
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          borderWidth: 1,
        },
      ],
    };

    // Chart configuration
    const config = {
      type: "pie",
      data: taskDistributionData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#fff",
            },
          },
        },
      },
    };

    // Render the chart
    const taskDistributionChart = new Chart(
      document.getElementById("taskDistributionChart"),
      config
    );
  });
  document.getElementById('toggleButton').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('expanded');
    mainContent.classList.toggle('expanded');
    sidebar.classList.toggle('expanded');
  });
  