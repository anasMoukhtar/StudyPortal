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

    const actions = document.createElement('td');
    const taskCell = document.createElement('td');
    const subjectCell = document.createElement('td');
    const dueDateCell = document.createElement('td');

    taskCell.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-120', 'h-[72px]', 'px-4', 'py-2', 'w-[400px]', 'text-white', 'text-sm', 'font-normal', 'leading-normal');
    subjectCell.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-240', 'h-[72px]','px-4', 'py-2', 'w-[400px]', 'text-[#93b0c8]', 'text-sm', 'font-normal', 'leading-normal');
    dueDateCell.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-360','h-[72px]', 'px-4', 'py-2', 'w-[400px]', 'text-[#93b0c8]', 'text-sm', 'font-normal', 'leading-normal');
    actions.classList.add('table-852ab644-a606-4272-ae85-877eccef5075-column-240', 'h-[72px]','px-4', 'py-2', 'w-[400px]', 'text-[#93b0c8]', 'text-sm', 'font-normal', 'leading-normal');

    actions.innerHTML = `<button>Edit</button>
                         <button>done</button>
                         <button>Delete</button>`;
    taskCell.innerText = taskInput.value;
    subjectCell.innerText = subject.value;
    dueDateCell.innerText = dueDate.value + ' days';

    newRow.appendChild(taskCell);
    newRow.appendChild(subjectCell);
    newRow.appendChild(dueDateCell);
    newRow.appendChild(actions);

    tbody.appendChild(newRow);

    taskInput.value = '';
    subject.value = '';
    dueDate.value = '';
};
