package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.TodoListRequest;
import edu.ut.todocloud.dto.response.TodoListResponse;
import edu.ut.todocloud.service.ITodoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class TodoListController {

    @Autowired
    private ITodoListService todoListService;

    @GetMapping
    public ResponseEntity<List<TodoListResponse>> getAllLists() {
        List<TodoListResponse> myLists = todoListService.getAllMyLists();
        return ResponseEntity.ok(myLists);
    }

    @PostMapping
    public ResponseEntity<TodoListResponse> createList(@RequestBody TodoListRequest request) {
        return ResponseEntity.ok(todoListService.createList(request));
    }
}
