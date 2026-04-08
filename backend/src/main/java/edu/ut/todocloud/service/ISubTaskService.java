package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.SubTaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;

public interface ISubTaskService {
    SubTaskResponse createSubTask(SubTaskRequest request);
}
