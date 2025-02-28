document.addEventListener("DOMContentLoaded", () => {
  // ====================== Constants and DOM Elements ======================
  const inputsContainer = document.getElementById("inputs");
  const overlay = document.getElementById("overlay");
  const inputBox = document.getElementById("inputBox");
  const listNameInput = document.getElementById("list-nameInput");
  const listInputTitle = document.getElementById("list-inputTitle");
  const listsContainer = document.getElementById("lists-container");
  const defaultList = document.getElementById("default");
  //======================= Database =============================
  // ====================== Task Management ======================
  function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Task saved:", task);
  }

  function removeTaskFromLocalStorage(taskToRemove) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter(task => task.title !== taskToRemove.title);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  function renderTask(taskData) {
    const taskContainer = document.createElement("div");
    taskContainer.className = "task";

    if (taskData.completed) {
      taskContainer.classList.add("completed");
    }

    taskContainer.style.opacity = "0";
    taskContainer.style.transform = "translateY(10px)";
    setTimeout(() => {
      taskContainer.style.opacity = "1";
      taskContainer.style.transform = "translateY(0)";
    }, 50);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = taskData.completed;
    checkbox.addEventListener("change", () => {
      taskContainer.classList.toggle("completed", checkbox.checked);
      updateTaskCompletion(taskData.title, checkbox.checked);
    });

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const taskTitle = document.createElement("strong");
    taskTitle.textContent = taskData.title;

    if (taskData.details) {
      const taskDetails = document.createElement("p");
      taskDetails.textContent = taskData.details;
      taskContent.appendChild(taskDetails);
    }
    taskContent.insertBefore(taskTitle, taskContent.firstChild);

    if (taskData.date) {
      const taskDate = document.createElement("small");
      taskDate.textContent = formatDate(taskData.date);
      taskContent.appendChild(taskDate);
    }

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

    taskContainer.append(checkbox, taskContent, deleteBtn);
    document.querySelector(".tasks").appendChild(taskContainer);
  }

  function updateTaskCompletion(title, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map(task => 
      task.title === title ? { ...task, completed: isCompleted } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

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

  // ====================== Input and Task Creation ======================
  const AddTasks = (event) => {
    const addTaskscontainer = event.target.closest('.addTask')
    
    const inputsContainer = addTaskscontainer.querySelector('#inputs');
  
    if (inputsContainer.classList.contains("show")) {
      inputsContainer.classList.remove("show");
      setTimeout(() => (inputsContainer.style.display = "none"), 300);
    } else {
      inputsContainer.style.display = "flex";
      setTimeout(() => inputsContainer.classList.add("show"), 10);
      inputsContainer.querySelector("input").focus();
    }
    inputsContainer.addEventListener("focusout", (event) => {
      setTimeout(() => {
        if (!inputsContainer.contains(document.activeElement)) {
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
  };
  window.AddTasks = AddTasks;
  function createTask() {
    const title = document.getElementById("title").value.trim();
    const details = document.getElementById("details").value.trim();
    const date = document.getElementById("date").value;

    if (title) {
      const taskData = {
        title,
        details: details || null,
        date: date || null,
        completed: false,
      };

      saveTaskToLocalStorage(taskData);
      renderTask(taskData);

      document.getElementById("title").value = "";
      document.getElementById("details").value = "";
      document.getElementById("date").value = "";

      setTimeout(() => {
        inputsContainer.classList.remove("show");
        setTimeout(() => (inputsContainer.style.display = "none"), 300);
      }, 100);
    }
  }

  // ====================== Options Menu ======================

  const options = (event) => {
    const clickedButton = event.target.closest('.header');
    const optionsMenu = clickedButton.querySelector('.options')
    const optionsToggle = clickedButton.querySelector('.options-toggle');
    const listName = event.target.parentNode
    const closeMenuOnClickOutside = (event) => {
      if (optionsMenu && optionsToggle && !optionsMenu.contains(event.target) && !optionsToggle.contains(event.target)) {
        optionsMenu.style.animation = 'collapse 0.3s forwards';
        optionsMenu.addEventListener('animationend', function onAnimationEnd() {
          optionsMenu.classList.remove("show");
          optionsMenu.removeEventListener('animationend', onAnimationEnd);
          document.removeEventListener('click', closeMenuOnClickOutside);
        }, { once: true });
      }
    };window.closeMenuOnClickOutside = closeMenuOnClickOutside;
    // The button that was clicked
    if (optionsMenu.classList.contains("show")) {
      optionsMenu.style.animation = 'collapse 0.3s forwards';
      optionsMenu.addEventListener('animationend', () => {
        optionsMenu.classList.remove("show");
        document.removeEventListener('click', closeMenuOnClickOutside);
      }, { once: true });
    } else {
      optionsMenu.classList.add("show");
      optionsMenu.style.animation = 'expand 0.3s forwards';
      document.addEventListener('click', closeMenuOnClickOutside);
    }
  };
  window.options = options;

  // ====================== List Management ======================
  const showInputBox = (Title, event) => {
    if (listInputTitle && overlay && inputBox) {
      listInputTitle.textContent = Title;
      const option = event.target.parentNode; // Get the parent of the clicked button
      const header = option.parentNode; // The header is the parent of the option
      const taskscontainer = header.parentNode;
      const listElement = taskscontainer.querySelector('#list-name'); // Get the #list-name element inside the taskscontainer
      overlay.style.display = "flex";
      inputBox.style.display = "flex";
      inputBox.style.animation = 'expandList 0.5s forwards';
  
      const Btn = event.target.textContent;
      if (Btn === 'Rename') {
        // When Rename button is clicked, show the rename UI
        document.getElementById('createListBtn').style.display = "none";
        document.getElementById('renameListBtn').style.display = "flex";
        
        // Attach the correct list element to the rename button
        document.getElementById('renameListBtn').onclick = () => rename(listElement);
      } else {
        // When Create button is clicked, show the create UI
        document.getElementById('renameListBtn').style.display = "none";
        document.getElementById('createListBtn').style.display = "flex";
      }
    }
  };
  
  window.showInputBox = showInputBox;

  const cancelList = () => {
    if (overlay && inputBox) {
      overlay.style.display = "none";
      setTimeout(() => (inputBox.style.display = "none"), 300);
      inputBox.style.animation = 'collapseList 0.2s forwards';
    }
  };
  window.cancelList = cancelList;
  const rename = (listElement) => {
    try {
      const ListTitle = listNameInput.value.trim();
      console.log(ListTitle);
  
      // Make sure the list element is passed and modify its title
      if (listElement && ListTitle) {
        listElement.textContent = ListTitle;
      }
      cancelList();  // Close the input box after renaming
    } catch (e) {
      console.error('Error renaming list:', e);
    }
  };
  
  window.rename = rename;
  const createList = () => {
    try {
      const ListTitle = listNameInput.value.trim();
      console.log(ListTitle)
      if (listsContainer && defaultList && ListTitle) {
        const clone = defaultList.cloneNode(true);
        clone.id = "newList"
        listsContainer.appendChild(clone);
        clone.querySelector('#list-name').textContent = ListTitle;
        listNameInput.value = '';
        console.log(clone)
      }
      cancelList();
    } catch (e) {
      console.error('Error creating list:', e);
    }
  };
  window.createList = createList;
  // ====================== Initialization ======================
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(renderTask);
  }
  loadTasks();
});