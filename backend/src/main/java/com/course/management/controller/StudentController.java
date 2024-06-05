package com.course.management.controller;

import com.course.management.dto.StudentDto;
import com.course.management.model.Student;
import com.course.management.model.Course;
import com.course.management.repository.StudentRepository;
import com.course.management.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }
    @PostMapping("/students/post")
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<StudentDto> saveStudent(@RequestBody StudentDto studentDTO) {
        List<Course> courses = studentDTO.getCourses();
        if (courses != null) {
            courses.forEach(course -> course.getStudents().add(convertToStudent(studentDTO)));
        }
        Student savedStudent = studentRepository.save(convertToStudent(studentDTO));
        return new ResponseEntity<StudentDto>(convertToDTO(savedStudent), HttpStatus.CREATED);
    }

    private Student convertToStudent(StudentDto studentDTO) {
        Student student = new Student();
        student.setId(studentDTO.getId());
        student.setName(studentDTO.getName());
        student.setEmail(studentDTO.getEmail());
        // Você pode definir outras propriedades aqui
        return student;
    }

    private StudentDto convertToDTO(Student student) {
        StudentDto studentDto = new StudentDto();
        studentDto.setId(student.getId());
        studentDto.setName(student.getName());
        studentDto.setEmail(student.getEmail());
        return studentDto;
    }


    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> removeUser(@PathVariable("id") long id) {
        studentRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}


