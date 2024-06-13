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
    private ToDoListRepository toDoListRepository; // Repositório de tarefas

    @GetMapping("/list")
    public ResponseEntity<List<ToDoList>> getTasks() {
        List<ToDoList> tasks = toDoListRepository.findAll(); // Busca todas as tarefas
        return ResponseEntity.ok(tasks); // Retorna a lista de tarefas
    }

    @PostMapping("/list")
    @CrossOrigin(origins = "http://localhost:8081")
    public ResponseEntity<List<ToDoList>> saveTask(@RequestBody ToDoList toDoList) {
        ToDoList savedToDo = toDoListRepository.save(toDoList); // Salva a nova tarefa
        List<ToDoList> updatedTasks = toDoListRepository.findAll(); // Retorna a lista atualizada
        return new ResponseEntity<>(updatedTasks, HttpStatus.CREATED); // Retorna a lista atualizada com status CREATED
    }

    @DeleteMapping("/list/{id}")
    public ResponseEntity<Void> removeTask(@PathVariable("id") long id) {
        toDoListRepository.deleteById(id); // Deleta a tarefa pelo ID
        return new ResponseEntity<>(HttpStatus.OK); // Retorna sucesso
    }
}