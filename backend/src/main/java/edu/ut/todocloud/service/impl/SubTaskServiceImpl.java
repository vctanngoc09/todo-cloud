package edu.ut.todocloud.service.impl;


import edu.ut.todocloud.dto.request.SubTaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;
import edu.ut.todocloud.mapper.SubTaskMapper;
import edu.ut.todocloud.model.SubTask;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.repository.ISubTaskRepository;
import edu.ut.todocloud.repository.ITaskRepository;
import edu.ut.todocloud.service.ISubTaskService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubTaskServiceImpl implements ISubTaskService {

    @Autowired
    private ISubTaskRepository subTaskRepository;

    @Autowired
    private ITaskRepository taskRepository;

    @Autowired
    private SubTaskMapper subTaskMapper;

    @Override
    public SubTaskResponse createSubTask(SubTaskRequest request) {
        // 1. Tìm Task cha
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Task cha với ID: " + request.getTaskId()));

        // 2. Chuyển DTO sang Entity và lưu
        SubTask subTask = subTaskMapper.toEntity(request, task);
        SubTask savedSubTask = subTaskRepository.save(subTask);

        // 3. Trả về DTO Response để tránh vòng lặp JSON
        return subTaskMapper.toResponse(savedSubTask);
    }

    @Override
    @Transactional
    public void saveAllSubTasks(List<String> subtaskTitles, Task task) {
        if (subtaskTitles == null || subtaskTitles.isEmpty()) return;

        List<SubTask> subTaskList = subtaskTitles.stream()
                .map(title -> subTaskMapper.toEntityFromTitle(title, task))
                .toList();

        subTaskRepository.saveAll(subTaskList);
    }

}
