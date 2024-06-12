package com.course.management.controller;

import com.course.management.model.ToDoList;
import com.course.management.repository.ToDoListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ToDoListController {

    @Autowired
    private ToDoListRepository toDoListRepository;

    @GetMapping("/list")
    public ResponseEntity<List<ToDoList>> getTasks() {
        List<ToDoList> tasks = toDoListRepository.findAll();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/list")
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<List<ToDoList>> saveTask(@RequestBody ToDoList toDoList) {
        ToDoList savedToDo = toDoListRepository.save(toDoList);
        List<ToDoList> updatedTasks = toDoListRepository.findAll(); // Retorna a lista atualizada
        return new ResponseEntity<>(updatedTasks, HttpStatus.CREATED);
    }

    @DeleteMapping("/list/{id}")
    public ResponseEntity<Void> removeTask(@PathVariable("id") long id) {
        toDoListRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
