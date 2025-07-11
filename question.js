function addQuestion() {
  const questionText = document.getElementById("questionText").value.trim();
  const option1 = document.getElementById("option1").value.trim();
  const option2 = document.getElementById("option2").value.trim();
  const option3 = document.getElementById("option3").value.trim();
  const option4 = document.getElementById("option4").value.trim();
  const correctIndex = document.getElementById("correctAnswer").value;

  const messageBox = document.getElementById("messageBox");

  // ✅ Validation
  if (!questionText || !option1 || !option2 || !option3 || !option4 || !correctIndex) {
    messageBox.textContent = "❌ Please fill all fields.";
    messageBox.style.color = "#ffcccc";
    return;
  }

  const options = [option1, option2, option3, option4];
  const correctAnswer = options[parseInt(correctIndex) - 1];

  // 🔁 Fetch existing questions or initialize
  let questions = JSON.parse(localStorage.getItem("questions")) || [];

  // 📌 Create question object
  const newQuestion = {
    id: questions.length + 1,
    question: questionText,
    options: options,
    answer: correctAnswer
  };

  questions.push(newQuestion);

  // 💾 Save to localStorage
  localStorage.setItem("questions", JSON.stringify(questions));

  // ✅ Feedback message
  messageBox.textContent = "✅ Question added successfully!";
  messageBox.style.color = "#dff";

  // 🧹 Clear fields
  document.getElementById("questionText").value = "";
  document.getElementById("option1").value = "";
  document.getElementById("option2").value = "";
  document.getElementById("option3").value = "";
  document.getElementById("option4").value = "";
  document.getElementById("correctAnswer").value = "";
}

// Load existing questions from localStorage or initialize
let questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];

// 🔁 Save to localStorage
function saveQuestions() {
  localStorage.setItem("quizQuestions", JSON.stringify(questions));
}

// ✅ Render all questions in a list
function renderQuestionList() {
  const container = document.getElementById("question-list");
  container.innerHTML = ""; // Clear before rendering

  if (questions.length === 0) {
    container.innerHTML = "<p>No questions added yet.</p>";
    return;
  }

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.style.marginBottom = "15px";
    div.style.padding = "15px";
    div.style.border = "1px solid #fff";
    div.style.borderRadius = "10px";
    div.style.background = "rgba(255,255,255,0.1)";
    div.innerHTML = `
      <strong>Q${index + 1}:</strong> ${q.question}<br>
      Options: ${q.options.join(", ")}<br>
      Answer: <strong>${q.answer}</strong><br><br>
      <button onclick="editQuestion(${index})">✏️ Edit</button>
      <button onclick="deleteQuestion(${index})">🗑️ Delete</button>
    `;
    container.appendChild(div);
  });
}

// 🔄 Edit a question
function editQuestion(index) {
  const q = questions[index];
  document.getElementById("questionText").value = q.question;
  document.getElementById("option1").value = q.options[0];
  document.getElementById("option2").value = q.options[1];
  document.getElementById("option3").value = q.options[2];
  document.getElementById("option4").value = q.options[3];

  const correctIndex = q.options.indexOf(q.answer) + 1;
  document.getElementById("correctAnswer").value = correctIndex.toString();

  // Remove old one, updated will be added on re-submit
  questions.splice(index, 1);
  saveQuestions();
  renderQuestionList();
}

// ❌ Delete a question
function deleteQuestion(index) {
  if (confirm("Are you sure you want to delete this question?")) {
    questions.splice(index, 1);
    saveQuestions();
    renderQuestionList();
  }
}

// ➕ Add question to array
function addQuestion() {
  const qText = document.getElementById("questionText").value;
  const options = [
    document.getElementById("option1").value,
    document.getElementById("option2").value,
    document.getElementById("option3").value,
    document.getElementById("option4").value
  ];
  const correctIndex = document.getElementById("correctAnswer").value;

  if (!qText || options.some(opt => !opt) || !correctIndex) {
    document.getElementById("messageBox").textContent = "Please fill all fields.";
    return;
  }

  const newQuestion = {
    id: Date.now(),
    question: qText,
    options,
    answer: options[correctIndex - 1]
  };

  questions.push(newQuestion);
  saveQuestions();
  renderQuestionList();

  document.getElementById("messageBox").textContent = "Question added successfully!";
  // Clear inputs
  document.getElementById("questionText").value = "";
  document.getElementById("option1").value = "";
  document.getElementById("option2").value = "";
  document.getElementById("option3").value = "";
  document.getElementById("option4").value = "";
  document.getElementById("correctAnswer").value = "";
}

// Initial load
document.addEventListener("DOMContentLoaded", renderQuestionList);
