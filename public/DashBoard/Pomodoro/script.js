// Initial time settings
let timeInMinutes = 25;
let timeInSeconds = timeInMinutes * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const startPauseButton = document.getElementById("startPause");
const resetButton = document.getElementById("Reset");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");

// Update the timer display
function updateTimerDisplay() {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Start the timer
function startTimer() {
  if (timerInterval === null) {
    timerInterval = setInterval(() => {
      if (timeInSeconds > 0) {
        timeInSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        startPauseButton.textContent = "Start"; // Reset button text
      }
    }, 1000);
  }
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Start/Pause button functionality
function startPauseTimer() {
  if (timerInterval === null) {
    startTimer();
    startPauseButton.textContent = "Pause";
  } else {
    pauseTimer();
    startPauseButton.textContent = "Start";
  }
}

// Reset the timer
function resetTimer() {
  pauseTimer();
  timeInSeconds = timeInMinutes * 60;
  updateTimerDisplay();
  startPauseButton.textContent = "Start";
}

// Increase time by 5 minutes
function increaseTime() {
  if (timerInterval === null) {
    timeInSeconds += 60 * 5;
    updateTimerDisplay();
  }
}

// Decrease time by 5 minutes (but not below 5 minutes)
function decreaseTime() {
  if (timerInterval === null && timeInSeconds > 60 * 5) {
    timeInSeconds -= 60 * 5;
    updateTimerDisplay();
  }
}

// Event listeners
startPauseButton.addEventListener("click", startPauseTimer);
resetButton.addEventListener("click", resetTimer);
increaseButton.addEventListener("click", increaseTime);
decreaseButton.addEventListener("click", decreaseTime);

// Initialize display
updateTimerDisplay();
