document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-task-form");
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const container = document.getElementById("task-cards-container");
    const addTaskModal = new bootstrap.Modal(document.getElementById("addTaskModal"));

    // Function to load tasks
    function loadTasks() {
        fetch("http://localhost:8080/list")
            .then(response => response.json())
            .then(data => {
                container.innerHTML = ""; // Clear container before adding new tasks
                data.forEach(task => {
                    addTaskCard(task);
                });
            })
            .catch(error => {
                console.error("Error:", error);
                console.log("Failed to load tasks.");
            });
    }

    // Add event listener to form submit
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = titleInput.value;
        const description = descriptionInput.value;

        // Check description length
        if (description.length > 45) {
            showAlert("Descrição deve ser menor que 46 caracteres");
            return;
        }

        fetch("http://localhost:8080/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: title, description: description })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add task.");
            }
            return response.json();
        })
        .then(task => {
            addTaskCard(task);
            form.reset();
            addTaskModal.hide();
            loadTasks(); // Refresh task list automatically
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to add task.");
            showAlert("Failed to add task.");
        });
    });

    // Function to add a task card to the container
    function addTaskCard(task) {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-3";

        card.innerHTML = `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text">ID: ${task.id}</p>
                    <button class="btn btn-danger btn-sm remove-task" data-id="${task.id}" style="position: absolute; top: 5px; right: 5px;">X</button>
                </div>
            </div>
        `;

        container.appendChild(card);

        card.querySelector(".remove-task").addEventListener("click", function() {
            const taskId = this.getAttribute("data-id");
            removeTask(taskId, card);
        });
    }

    // Function to remove a task
    function removeTask(taskId, cardElement) {
        fetch(`http://localhost:8080/list/${taskId}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                cardElement.remove();
            } else {
                console.error("Failed to delete task:", response.statusText);
                console.log("Failed to delete task.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to delete task.");
        });
    }

    // Function to show an alert message
    function showAlert(message) {
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert alert-danger mt-3";
        alertDiv.textContent = message;
        form.parentElement.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Load tasks on page load
    loadTasks();
});
