document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('add-student-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const container = document.getElementById('student-cards-container');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;

        fetch('http://localhost:8080/students/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email })
        })
        .then(response => response.json())
        .then(student => {
            addStudentCard(student);
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add student. Please try again later.');
        });
    });

    fetch('http://localhost:8080/students')
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                addStudentCard(student);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load students. Please try again later.');
        });

    function addStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'col-md-4';

        card.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${student.name}</h5>
                    <p class="card-text">Email: ${student.email}</p>
                    <p class="card-text">ID: ${student.id}</p>
                    <button class="btn btn-danger btn-sm remove-student" data-id="${student.id}">X</button>
                </div>
            </div>
        `;

        container.appendChild(card);
        
        card.querySelector('.remove-student').addEventListener('click', function() {
            const studentId = this.getAttribute('data-id');
            removeStudent(studentId, card);
        });
    }

    function removeStudent(studentId, cardElement) {
        fetch(`http://localhost:8080/students/${studentId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                cardElement.remove();
            } else {
                console.error('Failed to delete student:', response.statusText);
                alert('Failed to delete student. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete student. Please try again later.');
        });
    }
});
