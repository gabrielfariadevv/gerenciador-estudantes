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
    private CourseRepository courseRepository; // Repositório de cursos

    @Autowired
    private StudentRepository studentRepository; // Repositório de estudantes

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses() {
        List<Course> courses = courseRepository.findAll(); // Busca todos os cursos
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/courses/post")
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<Course> saveCourse(@RequestBody Course course) {
        if (course.getName() == null || course.getName().isEmpty()) {
            return ResponseEntity.badRequest().build(); // Retorna erro se o nome do curso for inválido
        }

        Course savedCourse = courseRepository.save(course); // Salva o curso
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED); // Retorna o curso salvo com status CREATED
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> removeCourse(
            @PathVariable("id") long id){
        Optional<Course> courseOptional = courseRepository.findById(id); // Busca o curso pelo ID
        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();
            List<Student> students = studentRepository.findByCourse(course); // Verifica se há estudantes no curso
            if (!students.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Retorna erro se o curso tem estudantes
            }
            courseRepository.deleteById(id); // Deleta o curso
            return ResponseEntity.ok().build(); // Retorna sucesso
        } else {
            return ResponseEntity.notFound().build(); // Retorna erro se o curso não for encontrado
        }
    }
}
