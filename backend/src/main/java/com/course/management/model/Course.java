package com.course.management.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String period;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students;

    public Course() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public List<Student> getStudents() {
        if (this.students == null) {
            this.students = new ArrayList<>();
        }
        return this.students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }
}
