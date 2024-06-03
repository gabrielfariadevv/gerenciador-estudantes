package com.course.management.controller;

import com.course.management.model.Course;
import com.course.management.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/courses/post")
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<Course> saveCourse(
            @RequestBody Course course) {
        Course savedCourse = courseRepository.save(course);
        return new ResponseEntity<Course>(
                savedCourse,
                HttpStatus.CREATED);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> removeCourse(
            @PathVariable("id") long id){
        courseRepository.deleteById(id);
        return new ResponseEntity<>(
                HttpStatus.OK
        );
    }
}
