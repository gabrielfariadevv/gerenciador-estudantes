document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-student-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const courseSelect = document.getElementById("course-select");
    const container = document.getElementById("student-cards-container");
    const addStudentModal = new bootstrap.Modal(document.getElementById("addStudentModal"));

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;
        const selectedCourses = Array.from(courseSelect.selectedOptions).map(option => ({ id: option.value }));

        fetch("http://localhost:8080/students/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, email: email, courses: selectedCourses })
        })
            .then(response => response.json())
            .then(student => {
                addStudentCard(student);
                form.reset();
                addStudentModal.hide();
            })
            .catch(error => {
                console.error("Error:", error);
                console.log("Failed to add student.");
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
            console.error("Error:", error);
            console.log("Failed to load this endpoint");
        });

    function addStudentCard(student) {
        const card = document.createElement("div");
        card.className = "col-md-4";

        card.innerHTML = `
                    <div class="card" style="width: 18rem;">
                        <img src="..." class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${student.name}</h5>
                            <p class="card-text">Email: ${student.email}</p>
                            <p class="card-text">Cursos: ${student.courses ? student.courses.map(course => course.name).join(", ") : 'Nenhum curso encontrado'}</p>
                            <p class="card-text">ID: ${student.id}</p>
                            <button class="btn btn-danger btn-sm remove-student" data-id="${student.id}">X</button>
                        </div>
                    </div>
                `;

        container.appendChild(card);

        card.querySelector(".remove-student").addEventListener("click", function () {
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
                    console.error("Failed to delete student:", response.statusText);
                    console.log("Failed to delete student.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                console.log("Failed to delete student.");
            });
    }

    fetch("http://localhost:8080/courses")
        .then(response => response.json())
        .then(courses => {
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.id;
                option.textContent = course.name;
                courseSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to load courses.");
        });
});
