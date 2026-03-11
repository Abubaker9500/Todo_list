// ─── DOM References ───────────────────────────────────────────────────────────
// Grab the "ADD" button, text input, and the list container from the HTML
const submit = document.getElementById("submit");
const todoInput = document.getElementById("todo");
const list = document.getElementById("list");

// ─── Tasks Array ──────────────────────────────────────────────────────────────
// Single source of truth for all tasks.
// Each task is an object: { text: "task name", done: false }
// This array is kept in sync with localStorage at all times.
let tasks = [];

// ─── Load on Startup ──────────────────────────────────────────────────────────
// When the page loads, check localStorage for any previously saved tasks.
// If found, parse them and re-render each one into the DOM.
const saved = localStorage.getItem("todos");
if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(task => renderTask(task));
}

// ─── Save to localStorage ─────────────────────────────────────────────────────
// Whenever the tasks array changes, call this to persist it.
function saveTasks() {
    localStorage.setItem("todos", JSON.stringify(tasks));
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
// Add a new task when the "ADD" button is clicked
submit.addEventListener("click", addTodo);

// Also allow submitting by pressing Enter in the input field
todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// ─── addTodo ──────────────────────────────────────────────────────────────────
// Creates a new task object, adds it to the tasks array,
// saves to localStorage, and renders it in the DOM.
function addTodo() {
    const value = todoInput.value.trim();

    // Don't add empty tasks
    if (value === "") return;

    // Create a new task object and add it to the array
    const task = { text: value, done: false };
    tasks.push(task);

    // Persist the updated array to localStorage
    saveTasks();

    // Render the new task in the DOM
    renderTask(task);

    // Clear the input field so the user can type the next task
    todoInput.value = "";
}

// ─── renderTask ───────────────────────────────────────────────────────────────
// Builds the DOM element for a task object and appends it to the list.
// Used both when adding new tasks and when loading saved tasks on startup.
// Each item has two interaction states:
//   1st click → marks it as done (checkmark + strikethrough), saves to localStorage
//   2nd click → removes it from the DOM and localStorage
//adds button to edit task
function renderTask(task) {
    // Create the wrapper div for the todo row
    const newItem = document.createElement("div");
    newItem.className = "listItem";

    // If the task was previously marked done, restore that state
    if (task.done) newItem.classList.add("done");

    // Create the visual checkbox (empty square by default)
    const checkbox = document.createElement("span");
    checkbox.className = "checkbox";

    // If task was saved as done, restore the checkmark
    if (task.done) checkbox.textContent = "✔";

    // Create the label that displays the task text
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = task.text;

    //Add an edit button
    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.textContent = "Edit";

    // Assemble the item: [checkbox] [label]
    newItem.appendChild(checkbox);
    newItem.appendChild(label);
    //added editButton
    newItem.appendChild(editButton);

    // Click handler: toggle done state on 1st click, delete on 2nd click
    newItem.addEventListener("click", function () {
        if (this.classList.contains("done")) {
            // Already marked done — remove from DOM and from tasks array
            tasks = tasks.filter(t => t !== task);
            saveTasks();
            this.remove();
        } else {
            // Mark as done in the DOM
            this.classList.add("done");
            checkbox.textContent = "✔";

            // Update the task object and save to localStorage
            task.done = true;
            saveTasks();
        }
    });

    //event listener for pressing edit button
    //replaces the tesk of the task with the new text
    editButton.addEventListener('click', function () {
        //prevents clicking on button from triggering clickin on label
        //avoid accidental strikeouts or deletion
        event.stopPropagation(); 
        let editedTask = prompt("Please enter the new task name", task.text);
        if (editedTask != null) {
            task.text = editedTask;
            label.textContent = editedTask;
            newItem.classList.remove("done");
            task.done = false;
            saveTasks();
        }
    });

    // Add the new item to the visible list
    list.appendChild(newItem);
}


