const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const themeButton = document.getElementById("themeButton");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filtroAtivo = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
}

function renderTasks(filter = filtroAtivo) {
    filtroAtivo = filter;
    taskList.innerHTML = "";

    let filtered = tasks;

    if (filter === "pending") {
        filtered = tasks.filter(task => !task.completed);
    }

    if (filter === "completed") {
        filtered = tasks.filter(task => task.completed);
    }

    if (filtered.length === 0) {
        const vazio = document.createElement("li");
        vazio.className = "task-vazia";
        vazio.textContent = tasks.length === 0
            ? "a página ainda está em branco — anote algo aí em cima"
            : "nada por aqui nesse filtro";
        taskList.appendChild(vazio);
        updateStats();
        return;
    }

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="complete-btn" aria-label="Marcar como concluída">✓</button>
                <button class="delete-btn" aria-label="Remover tarefa">✕</button>
            </div>
        `;

        li.querySelector(".complete-btn").addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(filtroAtivo);
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks(filtroAtivo);
        });

        taskList.appendChild(li);
    });

    updateStats();
}

function adicionarTarefa() {
    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";
    taskInput.focus();

    saveTasks();
    renderTasks(filtroAtivo);
}

addButton.addEventListener("click", adicionarTarefa);

taskInput.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        adicionarTarefa();
    }
});

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filtro").forEach(b => b.classList.remove("ativo"));
        button.classList.add("ativo");
        renderTasks(button.dataset.filter);
    });
});

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const escuro = document.body.classList.contains("dark");
    themeButton.querySelector(".theme-icon").textContent = escuro ? "☀" : "☾";
    localStorage.setItem("tema", escuro ? "dark" : "light");
});

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
    themeButton.querySelector(".theme-icon").textContent = "☀";
}

renderTasks();