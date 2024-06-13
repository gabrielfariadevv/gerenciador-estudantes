package com.course.management.controller;

import com.course.management.model.Student;
import com.course.management.repository.CourseRepository;
import com.course.management.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentRepository studentRepository; // Repositório de estudantes

    @Autowired
    private CourseRepository courseRepository; // Repositório de cursos

    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        // Verifica se o aluno já está cadastrado no mesmo curso
        List<Student> existingStudents = studentRepository.findByEmailAndCourse(student.getEmail(), student.getCourse());
        if (!existingStudents.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este aluno já está cadastrado neste curso.");
        }
        // Salva o aluno
        Student createdStudent = studentRepository.save(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent); // Retorna o aluno criado com status CREATED
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll(); // Busca todos os estudantes
        return ResponseEntity.ok(students); // Retorna a lista de estudantes
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> removeUser(@PathVariable("id") long id) {
        studentRepository.deleteById(id); // Deleta o estudante pelo ID
        return new ResponseEntity<>(HttpStatus.OK); // Retorna sucesso
    }
}
