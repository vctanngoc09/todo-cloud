package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.SubTaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;
import edu.ut.todocloud.model.SubTask;
import edu.ut.todocloud.model.Task;
import org.springframework.stereotype.Component;

@Component
public class SubTaskMapper {

    public SubTask toEntity(SubTaskRequest request, Task task) {
        if (request == null) return null;
        SubTask subTask = new SubTask();
        subTask.setTitle(request.getTitle());
        subTask.setCompleted(request.isCompleted());
        subTask.setTask(task);
        return subTask;
    }

    public SubTask toEntityFromTitle(String title, Task task) {
        if (title == null) return null;
        SubTask subTask = new SubTask();
        subTask.setTitle(title);
        subTask.setCompleted(false);
        subTask.setTask(task);
        return subTask;
    }

    public SubTaskResponse toResponse(SubTask subTask) {
        if (subTask == null) return null;
        SubTaskResponse response = new SubTaskResponse();
        response.setId(subTask.getId());
        response.setTitle(subTask.getTitle());
        response.setCompleted(subTask.isCompleted());
        response.setTaskId(subTask.getTask().getId());
        return response;
    }
}
