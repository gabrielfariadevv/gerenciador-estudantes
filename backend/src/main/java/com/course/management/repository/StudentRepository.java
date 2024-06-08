package com.course.management.repository;

import com.course.management.model.Course;
import com.course.management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByCourse(Course course);

    List<Student> findByEmailAndCourse(String email, Course course);
}
