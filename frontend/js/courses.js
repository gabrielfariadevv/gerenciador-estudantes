document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-course");
    const nameInput = document.getElementById("name");
    const periodInputs = document.querySelectorAll("input[name='period']");
    const container = document.getElementById("course-cards-container");
    const addCourseModal = new bootstrap.Modal(document.getElementById("addCourseModal"));

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value;
        let period = "";
        for (const input of periodInputs) {
            if (input.checked) {
                period = input.value;
                break;
            }
        }

        fetch("http://localhost:8080/courses/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, period: period })
        })
            .then(response => response.json())
            .then(course => {
                if (course.name !== "Nenhum Curso Atribuído") {
                    addCourseCard(course);
                }
                form.reset();
                addCourseModal.hide();
            })
            .catch(error => {
                console.error("Erro:", error);
                console.log("Falha ao adicionar curso. Tente novamente mais tarde.");
            });
    });

    fetch("http://localhost:8080/courses")
        .then(response => response.json())
        .then(data => {
            data.forEach(course => {
                if (course.name !== "Nenhum Curso Atribuído") {
                    addCourseCard(course);
                }
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao carregar este endpoint");
        });

    function addCourseCard(course) {
        const card = document.createElement("div");
        card.className = "col";

        card.innerHTML = `
            <div class="card custom-card-width mb-3 position-relative">
                <button class="btn btn-danger btn-sm position-absolute top-0 end-0 mt-2 me-2 remove-course" data-id="${course.id}">X</button>
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text">Período: ${course.period}</p>
                    <p class="card-text">ID: ${course.id}</p>
                </div>
            </div>
        `;

        container.appendChild(card);

        card.querySelector(".remove-course").addEventListener("click", function () {
            const courseId = this.getAttribute("data-id");
            removeCourse(courseId, card);
        });
    }

    function removeCourse(courseId, cardElement) {
        fetch(`http://localhost:8080/courses/${courseId}`, {
            method: "DELETE",
        })
            .then(response => {
                if (response.ok) {
                    cardElement.remove();
                } else if (response.status === 409) {
                    const alertContainer = document.getElementById("alert-container");
                    if (alertContainer) {
                        const alertHTML = `
                            <div class="alert alert-primary alert-dismissible fade show" role="alert">
                                Não é possível remover este curso, pois há estudantes cadastrados nele. Remova os estudantes antes de remover o curso.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                        alertContainer.innerHTML = alertHTML;
                    }
                } else {
                    console.error("Falha ao deletar curso:", response.statusText);
                    console.log("Falha ao deletar curso");
                }
            })
            .catch(error => {
                console.error("Erro:", error);
                console.log("Falha ao deletar curso.");
            });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-student-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const courseSelect = document.getElementById("course");
    const container = document.getElementById("student-cards-container");
    const addStudentModal = new bootstrap.Modal(document.getElementById("addStudentModal"));

    // Fetch cursos e popula o dropdown
    fetch("http://localhost:8080/courses")
        .then(response => response.json())
        .then(courses => {
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.id;
                option.textContent = course.name;
                courseSelect.appendChild(option);
            });

            // Adiciona a opção "Não cadastrar em nenhum curso" manualmente
            const noCourseOption = document.createElement("option");
            noCourseOption.value = "";
            noCourseOption.textContent = "Não cadastrar em nenhum curso";
            courseSelect.appendChild(noCourseOption);
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao carregar cursos.");
        });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;
        let courseId = courseSelect.value;

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
        .then(response => response.json())
        .then(student => {
            addStudentCard(student);
            form.reset();
            addStudentModal.hide();
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao adicionar estudante.");
        });
    });

    fetch("http://localhost:8080/students")
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                addStudentCard(student);
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            console.log("Falha ao carregar este endpoint");
        });

    function addStudentCard(student) {
        const card = document.createElement("div");
        card.className = "col-md-4";

        const courseName = student.course ? student.course.name : "Nenhum Curso Atribuído";

        card.innerHTML = `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${student.name}</h5>
                    <p class="card-text">Email: ${student.email}</p>
                    <p class="card-text">Curso: ${courseName}</p>
                    <p class="card-text">ID: ${student.id}</p>
                    <button class="btn btn-danger btn-sm remove-student" data-id="${student.id}">X</button>
                </div>
            </div>
        `;

        container.appendChild(card);

        card.querySelector(".remove-student").addEventListener("click", function() {
            const studentId = this.getAttribute("data-id");
            removeStudent(studentId, card);
        });
    }

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
});
