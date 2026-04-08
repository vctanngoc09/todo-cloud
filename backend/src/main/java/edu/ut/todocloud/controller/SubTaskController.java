package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.SubTaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;
import edu.ut.todocloud.service.ISubTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subtasks")
public class SubTaskController {

    @Autowired
    private ISubTaskService subTaskService;

    @PostMapping
    public ResponseEntity<SubTaskResponse> create(@RequestBody SubTaskRequest request) {
        return ResponseEntity.ok(subTaskService.createSubTask(request));
    }
}
