// ==================variables for the input Box============================== 
const overlayBox = document.getElementById('overlay')
const inputBox = document.getElementById('inputBox')
const confirmBox = document.querySelector('.confirmBox')
const listsContainer = document.getElementById('lists-container')
const listInputsTitle = document.getElementById('listInputs-Title')
const createListBtn = document.getElementById('createListBtn')
const renameListBtn = document.getElementById('renameListBtn')
const listNameInput = document.getElementById('list-nameInput') 
//==================end of the variables======================================= 
let selectedList = null // creating variable to manipulate lists easily
let Lists = JSON.parse(localStorage.getItem('Lists')) || [{name: 'My Tasks', id: 1, tasks:[]}] // Lists data 

//function to display the inputBox 
const display = (options) => {
    if (options.classList.contains('show')) {
        options.style.animation = 'collapse 0.3s ease-in-out forwards';
    
        setTimeout(() => {
            options.classList.remove('show');
        }, 300);
    } else {
        options.classList.add('show');
        options.style.animation = 'expand 0.3s ease-in-out forwards';
    }
}

// Function to show options menu for a list
const showOptionsToggle = (event) => { 
    event.stopPropagation(); // Prevent bubbling
    
    // Close all other open option menus first
    document.querySelectorAll('.options.show').forEach(menu => {
        if (menu !== event.target.parentNode.parentNode.querySelector('.options')) {
            display(menu);
        }
    });
    
    const OptionsToggleBtn = event.target
    const header = OptionsToggleBtn.parentNode
    const list = header.parentNode
    selectedList = list
    const options = list.querySelector('.options')
    display(options)
}
const showListInputs = (title, isCreatingList) => { 
    overlayBox.style.display = 'block'
    inputBox.style.display = 'flex'
    listInputsTitle.textContent = `${title}`
    
    if (isCreatingList) {
       createListBtn.style.display = 'block'
       renameListBtn.style.display = 'none'
       listNameInput.value = ''
    } else {
        createListBtn.style.display = 'none'
        renameListBtn.style.display = 'block'
        // Pre-fill with current list name for rename
        if (selectedList) {
            const listName = selectedList.querySelector('#list-name').textContent;
            listNameInput.value = listName;
        }
    }
    
    // If this was triggered from options menu, close the menu
    if (selectedList) {
        const options = selectedList.querySelector('.options')
        if (options.classList.contains('show')) {
            display(options)
        }
    }
}

const cancelBtn = () => {
    listNameInput.value = ''
    overlayBox.style.display = 'none'
    inputBox.style.display = 'none'
    confirmBox.classList.remove('show')
}

// Get a list by its ID
const getListById = (listID) => {
    return Lists.find(list => list.id === parseInt(listID));
}

// Get a task by its ID within a specific list
const getTaskById = (listId, taskId) => {
    const list = getListById(listId);
    if (list) {
        return list.tasks.find(task => task.id === parseInt(taskId));
    }
    return null;
}

// Create a new list
const createList = () => {
    const name = listNameInput.value.trim();
    if (!name) {
        showToast('Please enter a list name ❌');
        return;
    }
    
    const id = Date.now();
    const ListHTML = `
    <div data-id="${id}" class="List-container">
        <div class="header">
            <span id="list-name" style="font-size: 20px;">${name}</span>
            <div class="options-toggle" onclick="showOptionsToggle(event)">⚙️</div>
            <div class="options" id="options-menu">
                <span class="option new-list-option"><button onclick="showListInputs('Create List',true)" class="option-item">New List</button></span>
                <span class="option delete-list-option"><button onclick="deleteList()" class="option-item">Delete List</button></span>
                <span class="option clear-completed-option"><button onclick="clearCompletedTasks()" class="option-item">Clear completed tasks</button></span>
                <span class="option rename-list-option"><button onclick="showListInputs('Rename List', false)" class="option-item">Rename List</button></span>
            </div>
        </div>
     
        <div class="addTask">
            <button class="addTask-btn" onclick="showTasksInput(event)">
                <span style="filter: invert(1);" jsname="Xr1QTb" class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-M1Soyc">
                <span class="notranslate bVQs2b" aria-hidden="true">
                    <svg enable-background="new 0 0 24 24" focusable="false" height="24" viewBox="0 0 24 24" width="24" class="U70yRc NMm5M">
                    <rect fill="none" height="24" width="24"></rect>
                    <path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8 c1.57,0,3.04,0.46,4.28,1.25l1.45-1.45C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12s4.48,10,10,10c1.73,0,3.36-0.44,4.78-1.22 l-1.5-1.5C14.28,19.74,13.17,20,12,20z M19,15h-3v2h3v3h2v-3h3v-2h-3v-3h-2V15z"></path>
                    </svg>
                </span>
                </span>
                <span style="filter:sepia(1);">Add a task</span>
            </button>
            <div id="inputs">
                <input class="small" id="title" type="text" placeholder="Title">
                <input class="small" id="details" type="text" placeholder="Details">
                <input class="small" id="date" type="date" placeholder="Date">
            </div>
        </div>
        <div class="tasks"></div>
    </div>`;
    listsContainer.insertAdjacentHTML("beforeend", ListHTML);
    Lists.push({name: name, id: id, tasks: []});
    localStorage.setItem('Lists', JSON.stringify(Lists));
    cancelBtn();
    showToast(`List "${name}" created ✅`);
}

// Rename a list
const Rename = () => {
    const id = parseInt(selectedList.dataset.id);
    const newName = listNameInput.value.trim();
    
    if (!newName) {
        showToast('Please enter a list name ❌');
        return;
    }
    
    selectedList.querySelector('#list-name').textContent = newName;
    const list = getListById(id);
    if (list) {
        list.name = newName;
        localStorage.setItem('Lists', JSON.stringify(Lists));
        showToast(`List renamed to "${newName}" ✅`);
    }
    cancelBtn();
}

// Show or hide task input fields
// Show or hide task input fields
const showTasksInput = (event, editMode = false, taskId = null) => {
  // Find the closest list container
  let target = event.target;
  while (target && !target.classList.contains('List-container')) {
      target = target.parentNode;
  }
  
  if (!target) return;
  
  selectedList = target;
  const inputs = selectedList.querySelector('#inputs');
  
  // Toggle inputs visibility
  inputs.classList.toggle('show');
  
  // Store the editing state and task ID
  inputs.dataset.editMode = editMode;
  if (taskId) inputs.dataset.editingTaskId = taskId;
  else delete inputs.dataset.editingTaskId;
  
  // Clear input fields if we're showing them (and not in edit mode)
  if (inputs.classList.contains('show') && !editMode) {
      inputs.querySelector('#title').value = '';
      inputs.querySelector('#details').value = '';
      inputs.querySelector('#date').value = '';
      inputs.querySelector('#title').focus();
  }
  
  // Remove any existing event listeners to prevent duplicates
  const inputHandler = function(event) {
      if (event.key === 'Enter') {
          if (inputs.dataset.editMode === 'true') {
              updateTask(inputs.dataset.editingTaskId);
          } else {
              createTask();
          }
      }
  };
  
  inputs.removeEventListener('keydown', inputHandler);
  inputs.addEventListener('keydown', inputHandler);
}

// Edit a task
const editTask = (event) => {
  const taskElement = event.target.closest('.task');
  const taskId = parseInt(taskElement.dataset.id);
  const listElement = taskElement.closest('.List-container');
  const listId = parseInt(listElement.dataset.id);
  
  selectedList = listElement;
  const list = getListById(listId);
  const task = list.tasks.find(t => t.id === taskId);
  
  if (!task) return;
  
  // Get input elements
  const inputs = selectedList.querySelector('#inputs');
  const titleInput = inputs.querySelector('#title');
  const descriptionInput = inputs.querySelector('#details');
  const dueDateInput = inputs.querySelector('#date');
  
  // Pre-fill the inputs with task data
  titleInput.value = task.title;
  descriptionInput.value = task.description || '';
  dueDateInput.value = task.dueDate || '';
  
  // Show inputs in edit mode
  showTasksInput(event, true, taskId);
  
  // Focus on title input
  titleInput.focus();
}

// Add this new function to update a task
const updateTask = (taskId) => {
  const titleInput = selectedList.querySelector('#title');
  const descriptionInput = selectedList.querySelector('#details');
  const dueDateInput = selectedList.querySelector('#date');
  
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  
  if (!title) {
      showToast('Please enter a task title ❌');
      return;
  }
  
  const listId = parseInt(selectedList.dataset.id);
  const list = getListById(listId);
  const task = list.tasks.find(t => t.id === parseInt(taskId));
  
  if (task) {
      // Update task data
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      localStorage.setItem('Lists', JSON.stringify(Lists));
      
      // Update DOM
      const taskElement = selectedList.querySelector(`.task[data-id="${taskId}"]`);
      taskElement.querySelector('.task-title').textContent = title;
      taskElement.querySelector('label p').textContent = description;
      taskElement.querySelector('label small').textContent = dueDate;
      
      // Hide the inputs
      selectedList.querySelector('#inputs').classList.remove('show');
      
      showToast('Task updated ✅');
  }
}
const showConfirmBox = (Message, ConfirmBtnFunction) => {
  const title = confirmBox.querySelector('.title');
  title.textContent = Message;
  overlayBox.style.display = "block"
  confirmBox.classList.toggle('show');

  const confirmBtn = document.querySelector('.confirmBtn');
  
  // Remove previous click event to prevent multiple triggers
  confirmBtn.replaceWith(confirmBtn.cloneNode(true));
  const newConfirmBtn = document.querySelector('.confirmBtn');

  // Add the new event listener
  newConfirmBtn.addEventListener('click', ConfirmBtnFunction);
};

// Delete a list
const deleteList = () => {
    const id = parseInt(selectedList.dataset.id);
    if (id === 1) {
        showToast('Cannot delete the default list ❌');
        return;
    }
    
    // Confirm deletion
    const DELETE = ()=>{
        selectedList.style.animation = 'collapseList 0.2s ease-in-out forwards';

        setTimeout(() => {
            selectedList.remove();
            Lists = Lists.filter(list => list.id !== id);
            localStorage.setItem('Lists', JSON.stringify(Lists));
            showToast('List deleted ✅');
            cancelBtn();
        }, 300);
    } 
    showConfirmBox('are you sure you want to delete the List ? ',DELETE)
}

// Create a new task
const createTask = () => {
    const titleInput = selectedList.querySelector('#title');
    const descriptionInput = selectedList.querySelector('#details');
    const dueDateInput = selectedList.querySelector('#date');
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value;
    
    if (!title) {
        showToast('Please enter a task title ❌');
        return;
    }
    
    const tasksContainer = selectedList.querySelector('.tasks');
    const id = Date.now();
    const newtask = {
        id: id,
        title: title,
        description: description,
        dueDate: dueDate,
        completed: false
    };
    
    const taskHTML = `
    <div class="task" data-id="${id}">
        <input type="checkbox" id="task-${id}" onchange="toggleTaskComplete(event)">
        <label for="task-${id}">
            <strong class="task-title">${title}</strong>
            <p>${description}</p>
            <small>${dueDate}</small>
        </label>
        <div class="task-manipulator">
            <button class="delete-task-btn" onclick="deleteTask(event)">❌</button>
            <button class="edit-task-btn" onclick="editTask(event)">✎</button>
        </div>
    </div>`;
    
    const ListID = selectedList.dataset.id;
    const list = getListById(parseInt(ListID));
    if (list) {
        list.tasks.push(newtask);
        localStorage.setItem('Lists', JSON.stringify(Lists));
    }
    
    tasksContainer.insertAdjacentHTML("beforeend", taskHTML);
    
    // Reset inputs and hide the input box
    titleInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    selectedList.querySelector('#inputs').classList.remove('show');
    
    // Show message if no tasks were previously visible
    const noTasksMessage = selectedList.querySelector('.no-tasks');
    if (noTasksMessage && noTasksMessage.style.display !== 'none') {
        noTasksMessage.style.display = 'none';
    }
    
    showToast('Task added ✅');
}

// Toggle task completion status
const toggleTaskComplete = (event) => {
    const checkbox = event.target;
    const taskElement = checkbox.closest('.task');
    const taskId = parseInt(taskElement.dataset.id);
    const listElement = taskElement.closest('.List-container');
    const listId = parseInt(listElement.dataset.id);
    
    const list = getListById(listId);
    const task = list.tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = checkbox.checked;
        localStorage.setItem('Lists', JSON.stringify(Lists));
        
        // Apply visual indication
        if (checkbox.checked) {
            taskElement.classList.add('completed');
        } else {
            taskElement.classList.remove('completed');
        }
    }
}

// Delete a task
const deleteTask = (event) => {
  const taskElement = event.target.closest('.task');
  const taskId = parseInt(taskElement.dataset.id);
  const listElement = taskElement.closest('.List-container');
  const listId = parseInt(listElement.dataset.id);

  // Define delete action
  const DELETE = () => {
      // Visual feedback
      taskElement.style.animation = 'collapseTask 0.2s ease-in-out forwards';

      setTimeout(() => {
          // Remove from DOM
          taskElement.remove();

          // Remove from data model
          const list = getListById(listId);
          if (list) {
              list.tasks = list.tasks.filter(task => task.id !== taskId);
              showToast('Task deleted ✅');
              cancelBtn()
          }
      }, 200);
  };

  // Show confirmation checkbox
  showConfirmBox('Are you sure you want to delete this task?', DELETE);
};


// Clear completed tasks
const clearCompletedTasks = () => {
    const listId = parseInt(selectedList.dataset.id);
    const list = getListById(listId);
    
    if (!list || !list.tasks.some(task => task.completed)) {
        showToast('No completed tasks to clear ❓');
        return;
    }
    
    if (confirm('Are you sure you want to remove all completed tasks?')) {
        // Get all completed task elements
        const completedTaskElements = selectedList.querySelectorAll('.task input[type="checkbox"]:checked');
        
        if (completedTaskElements.length === 0) {
            showToast('No completed tasks to clear ❓');
            return;
        }
        
        // Remove from DOM with animation
        completedTaskElements.forEach(checkbox => {
            const taskElement = checkbox.closest('.task');
            taskElement.style.animation = 'collapseTask 0.2s ease-in-out forwards';
            
            setTimeout(() => {
                taskElement.remove();
            }, 200);
        });
        
        // Update data model
        list.tasks = list.tasks.filter(task => !task.completed);
        localStorage.setItem('Lists', JSON.stringify(Lists));
        
        // Show empty message if needed
        if (list.tasks.length === 0) {
            const noTasksMessage = selectedList.querySelector('.no-tasks');
            if (noTasksMessage) {
                noTasksMessage.style.display = 'block';
            }
        }
        
        showToast('Completed tasks cleared ✅');
        
        // Close options menu
        const options = selectedList.querySelector('.options');
        if (options.classList.contains('show')) {
            display(options);
        }
    }
}

// Close all dropdowns when clicking elsewhere on the page
document.addEventListener('click', function(e) {
    const isClickInsideOptions = e.target.closest('.options') || e.target.closest('.options-toggle');
    
    if (!isClickInsideOptions) {
        document.querySelectorAll('.options.show').forEach(menu => {
            display(menu);
        });
    }
});

// Close dropdowns on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.options.show').forEach(menu => {
            display(menu);
        });
        
        // Also close task input fields if visible
        document.querySelectorAll('#inputs.show').forEach(inputs => {
            inputs.classList.remove('show');
        });
        
        // Close overlay box if visible
        if (overlayBox.style.display === 'block') {
            cancelBtn();
        }
    }
});

// Initialize the app
const initialize = () => {
    listsContainer.innerHTML = ''; // Clear previous lists before rendering

    Lists.forEach(list => {
        const ListHTML = `
        <div data-id="${list.id}" class="List-container">
            <div class="header">
                <span id="list-name" style="font-size: 20px;">${list.name}</span>
                <div class="options-toggle" onclick="showOptionsToggle(event)">⚙️</div>
                <div class="options" id="options-menu">
                    <span class="option new-list-option"><button onclick="showListInputs('Create List', true)" class="option-item">New List</button></span>
                    <span class="option delete-list-option"><button onclick="deleteList()" class="option-item">Delete List</button></span>
                    <span class="option clear-completed-option"><button onclick="clearCompletedTasks()" class="option-item">Clear completed tasks</button></span>
                    <span class="option rename-list-option"><button onclick="showListInputs('Rename List', false)" class="option-item">Rename List</button></span>
                </div>
            </div>
            <div class="addTask">
                <button class="addTask-btn" onclick="showTasksInput(event)">
                    <span style="filter: invert(1);" jsname="Xr1QTb" class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-M1Soyc">
                        <span class="notranslate bVQs2b" aria-hidden="true">
                            <svg enable-background="new 0 0 24 24" focusable="false" height="24" viewBox="0 0 24 24" width="24" class="U70yRc NMm5M">
                                <rect fill="none" height="24" width="24"></rect>
                                <path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8 c1.57,0,3.04,0.46,4.28,1.25l1.45-1.45C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12s4.48,10,10,10c1.73,0,3.36-0.44,4.78-1.22 l-1.5-1.5C14.28,19.74,13.17,20,12,20z M19,15h-3v2h3v3h2v-3h3v-2h-3v-3h-2V15z"></path>
                            </svg>
                        </span>
                    </span>
                    <span style="filter: sepia(1);">Add a task</span>
                </button>
                <div id="inputs">
                    <input class="small" id="title" type="text" placeholder="Title">
                    <input class="small" id="details" type="text" placeholder="Details">
                    <input class="small" id="date" type="date" placeholder="Date">
                </div>
            </div>
            <div class="tasks"></div>
        </div>`;

        listsContainer.insertAdjacentHTML("beforeend", ListHTML);

        // Get the newly added list element
        const listElement = listsContainer.querySelector(`[data-id="${list.id}"]`);
        const tasksContainer = listElement.querySelector('.tasks');

        // Append tasks to the correct list
        list.tasks.forEach(task => {
            const taskHTML = `
            <div class="task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" id="task-${task.id}" onchange="toggleTaskComplete(event)" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}">
                    <strong class="task-title">${task.title}</strong>
                    <p>${task.description || ''}</p>
                    <small>${task.dueDate || ''}</small>
                </label>
                <div class="task-manipulator">
                    <button class="delete-task-btn" onclick="deleteTask(event)">❌</button>
                    <button class="edit-task-btn" onclick="editTask(event)">✎</button>
                </div>
            </div>`;

            tasksContainer.insertAdjacentHTML('beforeend', taskHTML);
        });
    });
};

// Initialize on page load
window.addEventListener("load", (event) => {
    initialize();
});