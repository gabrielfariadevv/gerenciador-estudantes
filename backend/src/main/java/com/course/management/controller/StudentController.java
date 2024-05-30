package com.course.management.controller;

import com.course.management.model.Student;
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
    private StudentRepository studentRepository;

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    @PostMapping("/students/post")
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<Student> saveStudent(
            @RequestBody Student student) {
        Student savedStudent = studentRepository.save(student);
        return new ResponseEntity<Student>(
                savedStudent,
                HttpStatus.CREATED);
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> removeUser(
            @PathVariable("id") long id){
        studentRepository.deleteById(id);
        return new ResponseEntity<>(
                HttpStatus.OK
        );
    }
}
