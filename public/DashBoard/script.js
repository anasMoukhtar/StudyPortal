// Add Task Function
const addTask = () => {
  const taskInput = document.getElementById('taskInput');
  const dueDate = document.getElementById('dueDate');
  const subject = document.getElementById('subject');
  const tbody = document.getElementById('tbody');

  if (!taskInput.value.trim()) {
    alert("Please enter a task.");
    return;
  }

  const newRow = document.createElement('tr');
  newRow.classList.add('border-t', 'border-t-[#344f65]');

  const taskCell = document.createElement('td');
  const subjectCell = document.createElement('td');
  const dueDateCell = document.createElement('td');
  const actionsCell = document.createElement('td');

  taskCell.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-120', 'h-[72px]', 'px-4', 'py-2', 'w-[400px]', 'text-white', 'text-sm', 'font-normal', 'leading-normal');
  subjectCell.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-240', 'h-[72px]', 'px-4', 'py-2', 'w-[400px]', 'text-[#93b0c8]', 'text-sm', 'font-normal', 'leading-normal');
  dueDateCell.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-360', 'h-[72px]', 'px-4', 'py-2', 'w-[400px]', 'text-[#93b0c8]', 'text-sm', 'font-normal', 'leading-normal');
  actionsCell.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-480', 'h-[72px]', 'px-4', 'py-2', 'w-60', 'text-[#93b0c8]', 'text-sm', 'font-bold', 'leading-normal', 'tracking-[0.015em]');

  // Add Edit, Done, and Delete buttons
  actionsCell.innerHTML = `
    <button onclick="editTask(this)">Edit</button>
    <button onclick="markAsDone(this)">Done</button>
    <button onclick="deleteTask(this)">Delete</button>
  `;

  taskCell.innerText = taskInput.value;
  subjectCell.innerText = subject.value;
  dueDateCell.innerText = dueDate.value + ' days';

  newRow.appendChild(taskCell);
  newRow.appendChild(subjectCell);
  newRow.appendChild(dueDateCell);
  newRow.appendChild(actionsCell);

  tbody.appendChild(newRow);

  // Clear input fields
  taskInput.value = '';
  subject.value = '';
  dueDate.value = '';
};

// Edit Task Function
const editTask = (button) => {
  const row = button.closest('tr');
  const taskCell = row.querySelector('td:nth-child(1)');
  const subjectCell = row.querySelector('td:nth-child(2)');
  const dueDateCell = row.querySelector('td:nth-child(3)');

  const newTask = prompt('Edit task:', taskCell.innerText);
  const newSubject = prompt('Edit subject:', subjectCell.innerText);
  const newDueDate = prompt('Edit due date (in days):', dueDateCell.innerText.replace(' days', ''));

  if (newTask) taskCell.innerText = newTask;
  if (newSubject) subjectCell.innerText = newSubject;
  if (newDueDate) dueDateCell.innerText = newDueDate + ' days';
};

// Mark Task as Done
const markAsDone = (button) => {
  const row = button.closest('tr');
  row.style.textDecoration = 'line-through';
  row.style.opacity = '0.6';
};

// Delete Task Function
const deleteTask = (button) => {
  const row = button.closest('tr');
  row.remove();
};
//Event listeners for switching between pages
//tasks
tasks = document.getElementById('tasks')
tasks.addEventListener('click', ()=>{
    window.location.href = '/DashBoard'
})

// Overview Page
const mainContent = document.getElementById('mainContent');
const overViewBtn = document.getElementById('overView');

if (overViewBtn) {
  overViewBtn.addEventListener('click', () => {
    window.location.href = '/DashBoard/OverView'
  });
}
// pomodoro 
const pomodoroBtn = document.getElementById('pomodoro');

if (pomodoroBtn) {
  pomodoroBtn.addEventListener('click', () => {
    window.location.href = '/DashBoard/Pomodoro'
  });
}
// flash cards
const flashCardsBtn = document.getElementById('flashCards');

if (flashCardsBtn) {
  flashCardsBtn.addEventListener('click', () => {
    window.location.href = '/DashBoard/FlashCards'
  });
}
// Ai
const aiBtn = document.getElementById('chatBot');

if (aiBtn) {
  aiBtn.addEventListener('click', () => {
    window.location.href = '/DashBoard/Ai'
  });
}
