//Sidebar
document.getElementById('toggleButton').addEventListener('click', function() {
  var sidebar = document.getElementById('sidebar');
  var mainContent = document.querySelector('.main-content');
  sidebar.classList.toggle('expanded');
  mainContent.classList.toggle('expanded');
  sidebar.classList.toggle('expanded');
});
//Event listeners for switching between pages
//tasks
tasks = document.getElementById('tasks')
tasks.addEventListener('click', ()=>{
    window.location.href = '/DashBoard/tasks'
})

// Overview Page
const mainContent = document.getElementById('mainContent');
const overViewBtn = document.getElementById('overView');

if (overViewBtn) {
  overViewBtn.addEventListener('click', () => {
    window.location.href = '/DashBoard/'
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
