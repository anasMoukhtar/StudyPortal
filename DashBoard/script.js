// Dropdown functionality
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

function setupDropdown(toggle, menu) {
    if (toggle && menu) {
        // Toggle dropdown on click
        toggle.addEventListener('click', function (event) {
            event.stopPropagation();
            menu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (event) {
            if (!menu.contains(event.target) && !toggle.contains(event.target)) {
                menu.classList.remove('active');
            }
        });

        // Keyboard accessibility
        toggle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                menu.classList.toggle('active');
            }
        });
    }
}

setupDropdown(dropdownToggle, dropdownMenu);