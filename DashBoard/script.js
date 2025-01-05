const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Toggle dropdown menu on button click
dropdownToggle.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the click from bubbling to the body
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    if (!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});