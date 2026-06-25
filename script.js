const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const themeButton = document.getElementById("themeButton");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function updateStats(){

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
    tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
    tasks.filter(task => !task.completed).length;
}

function renderTasks(filter = "all"){

    taskList.innerHTML = "";

    let filtered = tasks;

    if(filter === "pending"){
        filtered =
        tasks.filter(task => !task.completed);
    }

    if(filter === "completed"){
        filtered =
        tasks.filter(task => task.completed);
    }

    filtered.forEach(task => {

        const li =
        document.createElement("li");

        li.classList.add("task");

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="task-buttons">

                <button
                class="complete-btn">
                ✓
                </button>

                <button
                class="delete-btn">
                X
                </button>

            </div>
        `;

        li.querySelector(".complete-btn")
        .addEventListener("click", () => {

            task.completed =
            !task.completed;

            saveTasks();
            renderTasks(filter);
        });

        li.querySelector(".delete-btn")
        .addEventListener("click", () => {

            tasks =
            tasks.filter(
                t => t.id !== task.id
            );

            saveTasks();
            renderTasks(filter);
        });

        taskList.appendChild(li);
    });

    updateStats();
}

addButton.addEventListener("click", () => {

    const text =
    taskInput.value.trim();

    if(text === ""){
        alert("Digite uma tarefa.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed:false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
});

document
.querySelectorAll("[data-filter]")
.forEach(button => {

    button.addEventListener("click", () => {

        renderTasks(
            button.dataset.filter
        );

    });

});

themeButton.addEventListener("click", () => {

    document.body.classList.toggle(
        "dark"
    );

});

renderTasks();