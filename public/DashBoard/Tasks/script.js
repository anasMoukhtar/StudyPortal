document.addEventListener("DOMContentLoaded", () => {
    // Helper: Save a task object to local storage
    function saveTaskToLocalStorage(task) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Task saved:", task);
    }
  
    // (Optional) Helper: Remove a task from local storage (by title, for example)
    function removeTaskFromLocalStorage(taskToRemove) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter(task => task.title !== taskToRemove.title);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    // Function to toggle the input container visibility with animation
    const AddTasks = () => {
      const inputs = document.getElementById("inputs");
      // Toggle visibility
      if (inputs.classList.contains("show")) {
        inputs.classList.remove("show");
        setTimeout(() => (inputs.style.display = "none"), 300);
      } else {
        inputs.style.display = "flex";
        setTimeout(() => inputs.classList.add("show"), 10);
        inputs.querySelector("input").focus();
      }
    };
  
    // Expose AddTasks globally if you're calling it from HTML
    window.AddTasks = AddTasks;
  
    // Select the container holding the inputs
    const inputsContainer = document.getElementById("inputs");
  
    // Use focusout with a small delay to allow switching between fields
    inputsContainer.addEventListener("focusout", (event) => {
      setTimeout(() => {
        if (!inputsContainer.contains(document.activeElement)) {
          // If the title field is non-empty, create a task; otherwise, hide inputs.
          const titleValue = document.getElementById("title").value.trim();
          if (titleValue !== "") {
            createTask();
          } else {
            inputsContainer.classList.remove("show");
            setTimeout(() => (inputsContainer.style.display = "none"), 300);
          }
        }
      }, 200);
    });
  
    // Function to create a task (and save it to local storage)
    function createTask() {
      const title = document.getElementById("title").value.trim();
      const details = document.getElementById("details").value.trim();
      const date = document.getElementById("date").value;
  
      if (title) {
        // Build a task object (using null for missing details/date)
        const taskData = {
          title: title,
          details: details || null,
          date: date || null,
          completed: false,
        };
  
        // Save the task to local storage
        saveTaskToLocalStorage(taskData);
  
        // Render the task in the DOM
        renderTask(taskData);
  
        // Clear Inputs
        document.getElementById("title").value = "";
        document.getElementById("details").value = "";
        document.getElementById("date").value = "";
  
        // Hide inputs smoothly after task creation
        setTimeout(() => {
          inputsContainer.classList.remove("show");
          setTimeout(() => (inputsContainer.style.display = "none"), 300);
        }, 100);
      }
    }
  
    // Function to render a task object into the DOM
    function renderTask(taskData) {
      const taskContainer = document.createElement("div");
      taskContainer.className = "task";
  
      // If task is completed, mark it (for example, add a class)
      if (taskData.completed) {
        taskContainer.classList.add("completed");
      }
  
      // Fade-in animation for the task
      taskContainer.style.opacity = "0";
      taskContainer.style.transform = "translateY(10px)";
      setTimeout(() => {
        taskContainer.style.opacity = "1";
        taskContainer.style.transform = "translateY(0)";
      }, 50);
  
      // Create checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = taskData.completed;
      checkbox.addEventListener("change", () => {
        taskContainer.classList.toggle("completed", checkbox.checked);
        // Optionally, update the task's completed state in local storage:
        updateTaskCompletion(taskData.title, checkbox.checked);
      });
  
      // Create task content container
      const taskContent = document.createElement("div");
      taskContent.className = "task-content";
  
      const taskTitle = document.createElement("strong");
      taskTitle.textContent = taskData.title;
  
      // Append details if available
      if (taskData.details) {
        const taskDetails = document.createElement("p");
        taskDetails.textContent = taskData.details;
        taskContent.appendChild(taskDetails);
      }
      taskContent.insertBefore(taskTitle, taskContent.firstChild);
  
      // Append date if available
      if (taskData.date) {
        const taskDate = document.createElement("small");
        taskDate.textContent = formatDate(taskData.date);
        taskContent.appendChild(taskDate);
      }
  
      // Create delete button with fade-out animation
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "✖";
      deleteBtn.onclick = () => {
        taskContainer.style.opacity = "0";
        taskContainer.style.transform = "translateY(-10px)";
        setTimeout(() => {
          taskContainer.remove();
          removeTaskFromLocalStorage(taskData);
        }, 300);
      };
  
      // Append all elements to task container
      taskContainer.appendChild(checkbox);
      taskContainer.appendChild(taskContent);
      taskContainer.appendChild(deleteBtn);
  
      document.querySelector(".tasks").appendChild(taskContainer);
    }
  
    // Optional: Update task completion status in local storage
    function updateTaskCompletion(title, isCompleted) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.map(task => {
        if (task.title === title) {
          task.completed = isCompleted;
        }
        return task;
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    // Format Date Function: Returns "Today", "Tomorrow", or a formatted date
    function formatDate(inputDate) {
      const date = new Date(inputDate);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
  
      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
      } else {
        const options = { weekday: "short", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
      }
    }
  
    // Load tasks from local storage and render them
    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach(taskData => {
        renderTask(taskData);
      });
    }
  
    // Call loadTasks on page load
    loadTasks();
  });
  