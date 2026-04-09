package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.TaskResponse;
import edu.ut.todocloud.model.Task;

import java.util.List;

public interface ITaskService {
    Task createTask(TaskRequest taskRequest);
    List<TaskResponse> getTodayTasks();
}
