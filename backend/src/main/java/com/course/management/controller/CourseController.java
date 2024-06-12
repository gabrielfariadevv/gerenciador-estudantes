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
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/courses/post")
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<Course> saveCourse(@RequestBody Course course) {
        if (course.getName() == null || course.getName().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Course savedCourse = courseRepository.save(course);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> removeCourse(
            @PathVariable("id") long id){
        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            List<Student> students = studentRepository.findByCourse(course);
            if (!students.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            courseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
