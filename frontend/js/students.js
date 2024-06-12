document.addEventListener("DOMContentLoaded", function () {
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
                console.error("Error:", error);
                console.log("Failed to load students.");
            });
    }

    // Fetch courses and populate the dropdown
    fetch("http://localhost:8080/courses")
        .then(response => response.json())
        .then(courses => {
            courses.forEach(course => {
                if (course.name !== "No Course Assigned") {
                    // Add courses to dropdown
                    const option = document.createElement("option");
                    option.value = course.id;
                    option.textContent = course.name;
                    courseSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to load courses.");
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
                throw new Error("Failed to add student.");
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
            console.error("Error:", error);
            console.log("Failed to add student.");
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
        card.className = "col-md-4 mb-3"; // Set card size to col-md-4 and add margin-bottom for spacing

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
                console.error("Failed to delete student:", response.statusText);
                console.log("Failed to delete student.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to delete student.");
        });
    }

    // Carrega os estudantes ao carregar a página
    loadStudents();
});
