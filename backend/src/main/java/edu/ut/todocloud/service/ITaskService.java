package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.model.Task;

public interface ITaskService {
    Task createTask(TaskRequest taskRequest);
}
