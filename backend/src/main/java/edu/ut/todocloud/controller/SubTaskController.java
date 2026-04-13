package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.SubTaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;
import edu.ut.todocloud.service.ISubTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    // PUT /api/subtasks/{id}  { title, taskId, completed }  ← thêm mới
    @PutMapping("/{id}")
    public ResponseEntity<SubTaskResponse> update(
            @PathVariable Long id,
            @RequestBody SubTaskRequest request) {
        return ResponseEntity.ok(subTaskService.updateSubTask(id, request));
    }

    // DELETE /api/subtasks/{id}  ← thêm mới
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subTaskService.deleteSubTask(id);
        return ResponseEntity.noContent().build();
    }
}
