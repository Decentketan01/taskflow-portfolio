/// STATE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/// DOM ELEMENTS
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const filterBtns = document.querySelectorAll("[data-filter]");

/// ADDING TASK LOGIC
addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  const task = {
    id: Date.now(),
    text: taskInput.value,
    completed: false
  };

  tasks.push(task);
  saveAndRender();
  taskInput.value = "";
});

/// RENDERING TASKS
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    // ✅ Step 4: apply completed class correctly
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-left" onclick="toggleTask(${task.id})">
        <span class="check ${task.completed ? "checked" : ""}"></span>
        <span class="task-text">${task.text}</span>
      </div>
      <button onclick="deleteTask(${task.id})">❌</button>
    `;

    taskList.appendChild(li);
  });
}

/// TOGGLE TASK
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );
  // Soft haptic pulse
  document.body.style.transform = "scale(0.998)";
  setTimeout(() => {
    document.body.style.transform = "scale(1)";
  }, 120);

  saveAndRender();
}

/// DELETE TASK
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

/// SAVE TO LOCAL STORAGE + RE-RENDER
function saveAndRender(filter = "all") {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(filter);
}

/// FILTER BUTTONS
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    renderTasks(btn.dataset.filter);
  });
});

/// INITIAL RENDER
renderTasks();

////CUSTOM CURSOR
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", e => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

////MAGNETIC BUTTON
const magneticBtn = document.querySelector(".magnetic");

magneticBtn.addEventListener("mousemove", e => {
  const rect = magneticBtn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  magneticBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
});

magneticBtn.addEventListener("mouseleave", () => {
  magneticBtn.style.transform = "translate(0,0)";
});

////SCROLL TRIGGER
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(el => revealObserver.observe(el));

////ILLUSTRATION MICRO PARALLAX 
const blobs = document.querySelectorAll(".illustration-bg path");

document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;

  blobs.forEach((blob, i) => {
    blob.style.transform = `translate(${x * (i + 1)}px, ${y * (i + 1)}px)`;
  });
});

////SVG GRADIENT MICRO PARALLAX
const svgBg = document.querySelector(".illustration-bg");

document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 6;
  const y = (e.clientY / window.innerHeight - 0.5) * 6;

  svgBg.style.transform = `translate(${x}px, ${y}px)`;
});

