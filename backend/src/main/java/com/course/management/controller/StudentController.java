package com.course.management.controller;

import com.course.management.model.Course;
import com.course.management.model.Student;
import com.course.management.repository.CourseRepository;
import com.course.management.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/students")
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        // Verifica se o aluno já está cadastrado no mesmo curso
        List<Student> existingStudents = studentRepository.findByEmailAndCourse(student.getEmail(), student.getCourse());
        if (!existingStudents.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este aluno já está cadastrado neste curso.");
        }

        // Salva o aluno
        Student createdStudent = studentRepository.save(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> removeUser(@PathVariable("id") long id) {
        studentRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
