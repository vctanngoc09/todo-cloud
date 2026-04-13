package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.TaskDetailResponse;
import edu.ut.todocloud.dto.response.TaskResponse;
import edu.ut.todocloud.mapper.TaskMapper;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.service.ITaskService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/today")
    public ResponseEntity<List<TaskResponse>> getTodayTasks() {
        return ResponseEntity.ok(taskService.getTodayTasks());
    }

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
            @RequestParam String date) {

        LocalDate localDate = LocalDate.parse(date); // format: yyyy-MM-dd
        return ResponseEntity.ok(taskService.getTasksByDate(localDate));
    }
    @GetMapping("/{id}")
    public ResponseEntity<TaskDetailResponse> getTaskDetail(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskDetail(id));
    }
    @GetMapping("/week")
    public ResponseEntity<List<TaskResponse>> getTasksByWeek(
            @RequestParam String date) {

        LocalDate localDate = LocalDate.parse(date);

        return ResponseEntity.ok(taskService.getTasksByWeek(localDate));
    }
    @GetMapping("/month")
    public ResponseEntity<List<TaskResponse>> getTasksByMonth(
            @RequestParam String date) {

        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(taskService.getTasksByMonth(localDate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskRequest taskRequest) {
        try {
            // Service bây giờ trả về thẳng TaskResponse
            TaskResponse response = taskService.updateTask(id, taskRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật Task: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
