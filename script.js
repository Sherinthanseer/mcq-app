const questions = JSON.parse(localStorage.getItem("questions")) || [];


let currIndex = 0;
let userAnswer = {};
let timePerQuestion = 15; // seconds
let currentTimer;
let timeLeft;

// Start quiz: hide start screen, show quiz screen, load first question
function startQuiz() {
  document.getElementById("start").style.display = "none";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "flex";
  currIndex = 0;
  userAnswer = {};
  loadQuestion(currIndex);
}

// Load question & options, reset states, start timer
function loadQuestion(index) {
  const q = questions[index];
  document.getElementById("question-number").textContent = `Question ${index + 1} of ${questions.length}`;
  document.getElementById("question-text").textContent = q.question;

  const optionsForm = document.getElementById("options-form");
  optionsForm.innerHTML = "";

  // Disable next button until an option is selected
  const nextBtn = document.getElementById("next-btn");
  nextBtn.disabled = true;
  nextBtn.textContent = (index === questions.length - 1) ? "Submit" : "Next";

  q.options.forEach((option, i) => {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.id = `option${i}`;
    input.value = option;

    // When option selected, enable next button
    input.addEventListener("change", () => {
      nextBtn.disabled = false;
    });

    const label = document.createElement("label");
    label.htmlFor = `option${i}`;
    label.textContent = option;

    optionsForm.appendChild(input);
    optionsForm.appendChild(label);
  });

  startTimer();
}

// Timer logic
function startTimer() {
  timeLeft = timePerQuestion;
  document.getElementById("timer").textContent = `Time left: ${timeLeft}s`;

  clearInterval(currentTimer);
  currentTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(currentTimer);
      // Auto advance with no selection
      nextQuestion(true);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(currentTimer);
}

// Next question logic: manual or auto advance
// auto = true means timer expired
function nextQuestion(auto = false) {
  const selectedOption = document.querySelector('input[name="option"]:checked');

  if (!selectedOption && !auto) {
    alert("Please select an answer before continuing.");
    return;
  }

  userAnswer[currIndex] = selectedOption ? selectedOption.value : null;
  stopTimer();

  // Show immediate feedback
  showFeedback(currIndex);

  // Disable options and next button while showing feedback
  disableOptions();

  // After a short delay, move on or show result
  setTimeout(() => {
    if (currIndex === questions.length - 1) {
      showScore();
    } else {
      currIndex++;
      loadQuestion(currIndex);
    }
  }, 1500);
}

// Disable all options after answering (to prevent changes)
function disableOptions() {
  const inputs = document.querySelectorAll('input[name="option"]');
  inputs.forEach(input => input.disabled = true);
  document.getElementById("next-btn").disabled = true;
}

// Show green/red color feedback on answers
function showFeedback(index) {
  const q = questions[index];
  const optionsForm = document.getElementById("options-form");
  const inputs = optionsForm.querySelectorAll('input[name="option"]');
  const labels = optionsForm.querySelectorAll('label');

  inputs.forEach((input, i) => {
    const label = labels[i];
    if (input.value === q.answer) {
      // Correct answer - green
      label.style.backgroundColor = "#27ae60";
      label.style.color = "white";
      label.style.boxShadow = "0 0 15px #27ae60";
    }
    if (input.checked && input.value !== q.answer) {
      // Wrong answer selected - red
      label.style.backgroundColor = "#e74c3c";
      label.style.color = "white";
      label.style.boxShadow = "0 0 15px #e74c3c";
    }
  });
}

// Show final score screen with detailed answers
function showScore() {
  let score = 0;
  const resultScreen = document.getElementById("result-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const scoreText = document.getElementById("score-text");
  const scorePercent = document.getElementById("score-percent");

  questions.forEach((question, index) => {
    if (userAnswer[index] === question.answer) {
      score++;
    }
  });

  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  quizScreen.style.display = "none";
  resultScreen.style.display = "flex";

  scoreText.textContent = `You scored ${score} out of ${total}`;
  scorePercent.textContent = `${percent}%`;

  // Update SVG progress ring
  const circle = document.querySelector(".progress-ring");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  // Add detailed answer review below score (optional)
  let reviewHTML = "<h3>Review:</h3>";
  questions.forEach((q, i) => {
    const correct = (userAnswer[i] === q.answer);
    reviewHTML += `
      <p>
        <strong>Q${i + 1}:</strong> ${q.question}<br>
        Your answer: <span style="color:${correct ? '#27ae60' : '#e74c3c'}">${userAnswer[i] || "No answer"}</span><br>
        Correct answer: <span style="color:#27ae60">${q.answer}</span>
      </p>
    `;
  });

  // Create or update review container
  let reviewContainer = document.getElementById("answer-review");
  if (!reviewContainer) {
    reviewContainer = document.createElement("div");
    reviewContainer.id = "answer-review";
    reviewContainer.style.textAlign = "left";
    reviewContainer.style.marginTop = "20px";
    reviewContainer.style.maxHeight = "250px";
    reviewContainer.style.overflowY = "auto";
    reviewContainer.style.padding = "10px";
    reviewContainer.style.backgroundColor = "rgba(255,255,255,0.1)";
    reviewContainer.style.borderRadius = "12px";
    document.querySelector(".result-card").appendChild(reviewContainer);
  }
  reviewContainer.innerHTML = reviewHTML;
}

// Restart quiz: reset everything and go back to start screen
function restartQuiz() {
  currIndex = 0;
  userAnswer = {};
  stopTimer();

  document.getElementById("result-screen").style.display = "none";
  document.getElementById("start").style.display = "flex";
}

// Welcome message and logout (your existing logic)
const userName = localStorage.getItem("userName");
if (userName) {
  document.getElementById("username").textContent = `Welcome, ${userName}!`;
}

function logout() {
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}

  

// Show "Create Question" if user is admin
document.addEventListener("DOMContentLoaded", function () {
  const userEmail = localStorage.getItem("userEmail") || "";

  if (userEmail.toLowerCase() === "admin@infyniq.com") {
    const createBtn = document.getElementById("create-question-btn");
    createBtn.style.display = "inline-block";
    createBtn.onclick = function () {
      window.location.href = "admin.html"; // Redirect to admin page
    };
  }
});
