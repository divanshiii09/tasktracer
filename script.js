const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const greeting = document.getElementById("greeting");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiContext = confettiCanvas.getContext("2d");
const taskTrackerTitle = document.getElementById("taskTrackerTitle");

function setWelcomeMessage() {
  let userName = localStorage.getItem("userName");

  if (!userName) {
    userName = prompt("Please enter your name:");
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      userName = "Friend";
    }
  }

  greeting.innerHTML = `✨ Welcome, ${userName}! ✨`;
}

setWelcomeMessage();

let taskCount = 0;
let completedCount = 0;
let pendingCount = 0;

function updateTaskStats() {
  totalTasks.textContent = taskCount;
  completedTasks.textContent = completedCount;
  pendingTasks.textContent = pendingCount;
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  taskCount++;
  pendingCount++;
  updateTaskStats();

  const li = document.createElement("li");
  li.classList.add("task-item");

  li.innerHTML = `
    <span>${taskCount}. ${taskText}</span>
    <div>
      <button class="complete">✅</button>
      <button class="delete">❌</button>
    </div>
  `;

  taskList.appendChild(li);
  taskInput.value = "";
}

function markTaskCompleted(task) {
  if (!task.classList.contains("completed")) {
    task.classList.add("completed");
    completedCount++;
    pendingCount--;
    updateTaskStats();
    startConfetti(); // Trigger the confetti from navbar to footer
  }
}

function deleteTask(task) {
  taskList.removeChild(task);
  taskCount--;
  if (task.classList.contains("completed")) {
    completedCount--;
  } else {
    pendingCount--;
  }
  updateTaskStats();
}

addBtn.addEventListener("click", addTask);

taskList.addEventListener("click", (event) => {
  const task = event.target.closest(".task-item");

  if (event.target.classList.contains("complete")) {
    markTaskCompleted(task);
  } else if (event.target.classList.contains("delete")) {
    deleteTask(task);
  }
});

// Limited confetti range setup
let confettiParticles = [];
const colors = ["#006BFF", "#FFF100", "#08C2FF", "#BCF2F6"];

function startConfetti() {
  const navbar = document.querySelector("nav");
  const taskTrackerTitleTop = taskTrackerTitle.getBoundingClientRect().top + window.scrollY;

  // Get the height of the page excluding navbar and footer for confetti area
  const footer = document.querySelector("footer");
  const footerTop = footer.getBoundingClientRect().top + window.scrollY;
  const confettiHeight = footerTop - taskTrackerTitleTop;

  // Set canvas to cover the area from navbar to footer
  confettiCanvas.style.top = `${taskTrackerTitleTop}px`;
  confettiCanvas.style.height = `${confettiHeight}px`;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.style.display = "block";

  confettiParticles = Array.from({ length: 200 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * confettiHeight + taskTrackerTitleTop,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 6 + 2,
    speed: Math.random() * 3 + 2,
    angle: Math.random() * 360,
  }));

  requestAnimationFrame(updateConfetti);

  setTimeout(() => {
    confettiCanvas.style.display = "none";
  }, 3000);
}

function updateConfetti() {
  confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles.forEach((p) => {
    confettiContext.fillStyle = p.color;
    confettiContext.beginPath();
    confettiContext.arc(p.x, p.y - confettiCanvas.getBoundingClientRect().top, p.size, 0, 2 * Math.PI);
    confettiContext.fill();

    p.y += p.speed;
    p.x += Math.sin(p.angle) * 2;

    if (p.y > confettiCanvas.getBoundingClientRect().bottom + window.scrollY) p.y = taskTrackerTitleTop;
    if (p.x > window.innerWidth || p.x < 0) p.x = Math.random() * window.innerWidth;
  });

  requestAnimationFrame(updateConfetti);
}

// Adjust canvas size on resize
window.addEventListener("resize", () => {
  startConfetti();
});
