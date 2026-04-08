package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.SubTaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;
import edu.ut.todocloud.model.Task;

import java.util.List;

public interface ISubTaskService {
    SubTaskResponse createSubTask(SubTaskRequest request);
    void saveAllSubTasks(List<String> subtaskTitles, Task task);
}
