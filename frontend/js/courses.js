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
            addCourseCard(course);
            form.reset();
            addCourseModal.hide();
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to add course. Please try again later.");
        });
    });

    fetch("http://localhost:8080/courses")
        .then(response => response.json())
        .then(data => {
            data.forEach(course => {
                addCourseCard(course);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to load this endpoint");
        });

    function addCourseCard(course) {
        const card = document.createElement("div");
        card.className = "col";

        card.innerHTML = `
            <div class="card custom-card-width mb-3 position-relative">
                <button class="btn btn-danger btn-sm position-absolute top-0 end-0 mt-2 me-2 remove-course" data-id="${course.id}">X</button>
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text">Period: ${course.period}</p>
                    <p class="card-text">ID: ${course.id}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
        
        card.querySelector(".remove-course").addEventListener("click", function() {
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
            } else {
                console.error("Failed to delete course:", response.statusText);
                console.log("Failed to delete course. Please try again later.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Failed to delete course. Please try again later.");
        });
    }
});
