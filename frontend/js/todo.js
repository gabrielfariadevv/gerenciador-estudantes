document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-task-form");
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const container = document.getElementById("task-cards-container");
    const addTaskModal = new bootstrap.Modal(document.getElementById("addTaskModal"));

    // Função para carregar as tarefas
    function loadTasks() {
        fetch("http://localhost:8080/list")
            .then(response => response.json())
            .then(data => {
                container.innerHTML = ""; // Limpa o container antes de adicionar novas tarefas
                data.forEach(task => {
                    addTaskCard(task);
                });
            })
            .catch(error => {
                console.error("Erro:", error);
                console.log("Falha ao carregar tarefas.");
            });
    }

    // Adiciona evento de submit no formulário
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = titleInput.value;
        const description = descriptionInput.value;

        // Verifica o comprimento da descrição
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
                throw new Error("Falha ao adicionar tarefa.");
            }
            return response.json();
        })
        .then(task => {
            addTaskCard(task);
            form.reset();
            addTaskModal.hide();
            loadTasks(); // Atualiza a lista de tarefas automaticamente
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao adicionar tarefa.");
            showAlert("Falha ao adicionar tarefa.");
        });
    });

    // Função para adicionar um card de tarefa no container
    function addTaskCard(task) {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-3";

        card.innerHTML = `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text">ID: ${task.id}</p>
                    <button class="btn btn-danger btn-sm remove-task" data-id="${task.id}" style="position: absolute; top: 5px; right: 5px;">x</button>
                </div>
            </div>
        `;

        container.appendChild(card);

        card.querySelector(".remove-task").addEventListener("click", function() {
            const taskId = this.getAttribute("data-id");
            removeTask(taskId, card);
        });
    }

    // Função para remover uma tarefa
    function removeTask(taskId, cardElement) {
        fetch(`http://localhost:8080/list/${taskId}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                cardElement.remove();
            } else {
                console.error("Falha ao deletar tarefa:", response.statusText);
                console.log("Falha ao deletar tarefa.");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao deletar tarefa.");
        });
    }

    // Função para mostrar uma mensagem de alerta
    function showAlert(message) {
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert alert-danger mt-3";
        alertDiv.textContent = message;
        form.parentElement.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Carrega as tarefas ao carregar a página
    loadTasks();
});
