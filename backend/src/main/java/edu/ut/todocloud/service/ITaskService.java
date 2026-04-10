package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.TagResponse;
import edu.ut.todocloud.dto.response.TaskDetailResponse;
import edu.ut.todocloud.dto.response.TaskResponse;
import edu.ut.todocloud.model.Task;

import java.time.LocalDate;
import java.util.List;

public interface ITaskService {
    Task createTask(TaskRequest taskRequest);
    List<TaskResponse> getTodayTasks();
    List<TaskResponse> getTasksByDate(LocalDate date);
    TaskDetailResponse getTaskDetail(Long taskId);
    List<TaskResponse> getTasksByWeek(LocalDate date);
    List<TaskResponse> getTasksByMonth(LocalDate date);
}
