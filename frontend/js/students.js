document.addEventListener("DOMContentLoaded", function () {
    // Elementos do DOM relacionados ao formulário de adicionar estudante
    const form = document.getElementById("add-student-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const courseSelect = document.getElementById("course");
    const container = document.getElementById("student-cards-container");
    const addStudentModal = new bootstrap.Modal(document.getElementById("addStudentModal"));

    // Função para carregar os estudantes existentes
    function loadStudents() {
        fetch("http://localhost:8080/students")
            .then(response => response.json())
            .then(data => {
                container.innerHTML = ""; // Limpa o container antes de adicionar novos estudantes
                data.forEach(student => {
                    addStudentCard(student);
                });
            })
            .catch(error => {
                console.error("Erro:", error);
                console.log("Falha ao carregar estudantes.");
            });
    }

    // Busca cursos e popula o dropdown
    fetch("http://localhost:8080/courses")
        .then(response => response.json())
        .then(courses => {
            courses.forEach(course => {
                if (course.name !== "Nenhum curso cadastrado") {
                    // Adiciona cursos ao dropdown
                    const option = document.createElement("option");
                    option.value = course.id;
                    option.textContent = course.name;
                    courseSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao carregar cursos.");
        });

    // Adiciona o evento de submit no formulário
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;
        let courseId = courseSelect.value;

        // Se nenhum curso for selecionado, define courseId como null
        if (courseId === "") {
            courseId = null;
        }

        fetch("http://localhost:8080/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, email: email, course: { id: courseId } })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Falha ao adicionar estudante.");
            }
            return response.json();
        })
        .then(student => {
            addStudentCard(student);
            form.reset();
            addStudentModal.hide();
            loadStudents(); // Atualiza a lista de estudantes automaticamente
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao adicionar estudante.");
            showAlert("Falha ao adicionar aluno, Este aluno já está cadastrado neste curso!");
        });
    });

    // Função para adicionar um alerta na tela
    function showAlert(message) {
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert alert-danger mt-3";
        alertDiv.textContent = message;
        form.parentElement.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Função para adicionar um card de estudante no container
    function addStudentCard(student) {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-3"; // Define o tamanho do card para col-md-4 e adiciona margem inferior

        const courseName = student.course ? student.course.name : "Nenhum curso cadastrado";

        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${student.name}</h5>
                    <p class="card-text">Email: ${student.email}</p>
                    <p class="card-text">Curso: ${courseName}</p>
                    <p class="card-text">ID: ${student.id}</p>
                    <button class="btn btn-danger btn-sm remove-student" data-id="${student.id}" style="position: absolute; top: 5px; right: 5px;">X</button>
                </div>
            </div>
        `;

        container.appendChild(card);

        card.querySelector(".remove-student").addEventListener("click", function() {
            const studentId = this.getAttribute("data-id");
            removeStudent(studentId, card);
        });
    }

    // Função para remover um estudante
    function removeStudent(studentId, cardElement) {
        fetch(`http://localhost:8080/students/${studentId}`, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                cardElement.remove();
            } else {
                console.error("Falha ao deletar estudante:", response.statusText);
                console.log("Falha ao deletar estudante.");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao deletar estudante.");
        });
    }

    // Carrega os estudantes ao carregar a página
    loadStudents();
});
