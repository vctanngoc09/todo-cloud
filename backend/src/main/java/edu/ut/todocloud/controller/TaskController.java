package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.TaskResponse;
import edu.ut.todocloud.mapper.TaskMapper;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.service.ITaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private ITaskService taskService;

    @Autowired
    private TaskMapper taskMapper;

    @PostMapping
    public ResponseEntity<?> createNewTask(@RequestBody TaskRequest taskRequest) {
        try {
            Task createdTask = taskService.createTask(taskRequest);
            TaskResponse response = taskMapper.toResponse(createdTask);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo Task: " + e.getMessage());
        }
    }
    @GetMapping("/by-date")
    public ResponseEntity<List<TaskResponse>> getTasksByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(taskService.getTasksByDate(date));
    }
}
