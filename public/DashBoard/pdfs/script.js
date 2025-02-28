let quizData = []; // Stores all quiz questions
let currentQuestionIndex = 0; // Tracks the current question
let selectedAnswers = []; // Stores user answers
let totalTime = 0; // Total test time in seconds
let timerInterval; // Timer instance
let fileExt; // File extension
const nextBtn = document.getElementById('next-btn') 
// Event listener for file upload
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function getFileExtension(filename) {
  const parts = filename.split('.');
  
  if (parts.length === 1 || (parts.length === 2 && filename.startsWith('.'))) {
    return '';
  }

  return parts.pop().toLowerCase(); 
}
// Toggle upload container visibility
function Addbtn() {
  const uploadContainer = document.getElementById('Upload-container');
  if (uploadContainer.style.opacity === '0' || uploadContainer.style.display === 'none') {
    uploadContainer.style.display = 'block';
    uploadContainer.style.animation = 'expandUpload 0.3s forwards';
  } else {
    uploadContainer.style.animation = 'collapseUpload 0.3s forwards';
    setTimeout(() => {
      uploadContainer.style.display = 'none';
    }, 500);
  }
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    showToast('No file selected ❌')
    return;
  }

  fileExt = getFileExtension(file.name);

  // Initialize FormData and append file
  const formData = new FormData();
  formData.append("pdfFile", file);

  if (fileExt === 'pdf') {
    fetch('/upload-pdf', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('📂 File received:', data);
      // Ensure it's properly parsed
      if (!data.pages || !Array.isArray(data.pages)) {
        throw new Error('Invalid quiz format.');
      }

      quizData = data.pages.flatMap(page => page.questions);
      if (quizData.length === 0) {
        throw new Error('No questions found in the file.');
      }

      // Hide "no exams" message and show test settings
      document.getElementById('noexams').style.display = 'none';
      document.getElementById('test-settings').hidden = false;
      document.getElementById('progress').hidden = false;
      document.getElementById('progress-text').textContent = `Question 0/${quizData.length}`;
    })
    .catch(error => {
      console.error('❌ Error:', error);
      showToast('Failed to process the file.❌')
    });

  } else if (fileExt === 'json') {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.pages || !Array.isArray(data.pages)) {
          throw new Error('Invalid quiz format.');
        }

        quizData = data.pages.flatMap(page => page.questions);
        if (quizData.length === 0) {
          throw new Error('No questions found in the file.');
        }

        document.getElementById('noexams').style.display = 'none';
        document.getElementById('test-settings').hidden = false;
        document.getElementById('progress').hidden = false;
        document.getElementById('progress-text').textContent = `Question 0/${quizData.length}`;
      } catch (error) {
        console.error('❌ Error parsing JSON:', error);
        showToast('Invalid JSON file ❌')
      }
    };
    reader.readAsText(file);
  }
}

// Start the test
function startTest() {
  const totalTimeInput = document.getElementById('totalTime').value;
  if (!totalTimeInput || totalTimeInput < 1) {
    showToast('Please enter a valid total test time. ❌')
    return;
  }

  totalTime = totalTimeInput * 60; // Convert minutes to seconds
  currentQuestionIndex = 0;
  selectedAnswers = [];

  // Hide test settings and show the first question
  document.getElementById('test-settings').hidden = true;
  document.getElementById('timer').hidden = false; // Show timer
  document.getElementById('navigation-buttons').style.display = "flex"; // Show navigation buttons
  document.getElementById('question-navigator-btn').hidden = false; // Show question navigator button
  showQuestion(currentQuestionIndex);
  startTimer();
}

// Start the timer for the entire test
function startTimer() {
  const timerEl = document.getElementById('timer');
  if (!timerEl) {
    console.error('Timer element not found!');
    return;
  }

  timerInterval = setInterval(() => {
    totalTime--;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    timerEl.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      showToast('Time\'s up!');
      endTest();
    }
  }, 1000);
}

// Display the current question
// Add active state to selected answer
function selectAnswer(question, key, value) {
  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.options button');
  buttons.forEach(button => button.classList.remove('active'));

  // Add active class to the selected button
  event.target.classList.add('active');

  // Save the selected answer
  selectedAnswers[currentQuestionIndex] = { question, selected: key.toUpperCase(), answer: value };
}

// Navigate to the previous question
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
}

// Navigate to the next question
function nextQuestion() {
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }
}

// Open the question navigator modal
function openQuestionNavigator() {
  const modal = document.getElementById('question-navigator-modal');
  const grid = document.getElementById('question-grid');
  grid.innerHTML = ''; // Clear previous content

  // Create buttons for each question
  quizData.forEach((_, index) => {
    const button = document.createElement('button');
    button.textContent = index + 1;
    if (selectedAnswers[index]) {
      button.classList.add('answered'); // Mark answered questions
    }
    button.onclick = () => {
      currentQuestionIndex = index;
      showQuestion(currentQuestionIndex);
      closeQuestionNavigator();
    };
    grid.appendChild(button);
  });

  modal.style.display = 'flex';
}

// Close the question navigator modal
function closeQuestionNavigator() {
  const modal = document.getElementById('question-navigator-modal');
  modal.style.display = 'none';
}

// Update showQuestion to highlight the selected answer
function showQuestion(index) {
  const container = document.getElementById('question-container');
  container.innerHTML = ''; // Clear previous content
  if(index + 1 >= quizData.length) {
    nextBtn.style.visibility = 'hidden';
  }else{
    nextBtn.style.visibility = 'visible';
  }
  // Update progress indicator
  document.getElementById('progress-text').textContent = `Question ${index + 1}/${quizData.length}`;

  // Display the question
  const questionEl = document.createElement('h2');
  questionEl.innerHTML = quizData[index].question;
  container.appendChild(questionEl);

  // Display answer options
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'options';

  Object.entries(quizData[index].answers).forEach(([key, value]) => {
    const btn = document.createElement('button');
    btn.textContent = `${key.toUpperCase()}: ${value}`;
    btn.onclick = () => selectAnswer(quizData[index].question, key, value);

    // Check if this option is selected and apply the active class
    if (selectedAnswers[index] && selectedAnswers[index].selected === key.toUpperCase()) {
      btn.classList.add('active');
    }

    optionsDiv.appendChild(btn);
  });

  container.appendChild(optionsDiv);
  MathJax.typesetPromise(); // Render MathJax content
}
// End the test
function endTest() {
  clearInterval(timerInterval); // Stop the timer
  const container = document.getElementById('question-container');
  container.innerHTML = '<h2>Test Complete!</h2>';

  // Display review of answers
  const reviewList = document.createElement('ul');
  selectedAnswers.forEach(({ question, selected, answer }) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${question}</strong><br>Your Answer: ${selected}: ${answer}`;
    reviewList.appendChild(li);
  });

  container.appendChild(reviewList);
}