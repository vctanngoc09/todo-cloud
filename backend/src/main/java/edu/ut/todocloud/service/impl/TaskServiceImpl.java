package edu.ut.todocloud.service.impl;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.TaskResponse;
import edu.ut.todocloud.mapper.TaskMapper;
import edu.ut.todocloud.model.*;
import edu.ut.todocloud.repository.ITaskRepository;
import edu.ut.todocloud.repository.ITodoListRepository;
import edu.ut.todocloud.repository.IUserRepository;
import edu.ut.todocloud.service.ISubTaskService;
import edu.ut.todocloud.service.ITagService;
import edu.ut.todocloud.service.ITaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class TaskServiceImpl implements ITaskService {

    @Autowired
    private ITaskRepository taskRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ITodoListRepository todoListRepository;

    // TIÊM SERVICE THAY VÌ REPOSITORY
    @Autowired
    private ISubTaskService subTaskService;
    @Autowired
    private ITagService tagService;

    @Autowired private TaskMapper taskMapper;

    @Override
    @Transactional
    public Task createTask(TaskRequest taskRequest) {
        // 1. Lấy User hiện tại (Logic thuộc về User domain)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Tìm TodoList (Logic đơn giản, có thể dùng trực tiếp Repo hoặc gọi TodoListService)
        TodoList todoList = null;
        if (taskRequest.getListId() != null) {
            todoList = todoListRepository.findById(taskRequest.getListId()).orElse(null);
        }

        // 3. Tạo và Lưu Task cha
        Task task = taskMapper.toEntity(taskRequest, user, todoList);
        Task savedTask = taskRepository.save(task);

        // 4. Ủy quyền việc lưu Subtasks cho SubTaskService
        subTaskService.saveAllSubTasks(taskRequest.getSubtasks(), savedTask);

        // 5. Ủy quyền việc lưu Tags cho TagService
        tagService.assignTagsToTask(taskRequest.getTagIds(), savedTask);

        return savedTask;
    }
    @Override
    public List<TaskResponse> getTasksByDate(LocalDate date) {
        // 1. Lấy user đang đăng nhập
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Tạo khoảng thời gian trong ngày
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // 3. Query DB
        List<Task> tasks = taskRepository.findAllByUserAndDueDateBetween(user, startOfDay, endOfDay);

        // 4. Map sang DTO (QUAN TRỌNG)
        return tasks.stream()
                .map(taskMapper::toResponse)
                .toList();
    }
}