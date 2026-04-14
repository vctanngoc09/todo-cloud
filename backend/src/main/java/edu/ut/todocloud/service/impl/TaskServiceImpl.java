package edu.ut.todocloud.service.impl;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.TaskDetailResponse;
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
import java.util.stream.Collectors;

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
    public List<TaskResponse> getTodayTasks() {
        // 1. Lấy User hiện tại
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Xác định mốc thời gian ngày hôm nay (00:00:00 -> 23:59:59)
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        // 3. Truy vấn và Map sang Response
        return taskRepository.findByUserAndDueDateBetween(user, startOfDay, endOfDay)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<TaskResponse> getTasksByDate(LocalDate date) {
        // 1. Lấy user hiện tại
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Convert date -> start & end of day
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // 3. Query + map
        return taskRepository.findByUserAndDueDateBetween(user, startOfDay, endOfDay)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Override
    public TaskDetailResponse getTaskDetail(Long taskId) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));


        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền truy cập task này");
        }

        // 4. Map sang TaskDetailResponse
        return taskMapper.toDetailResponse(task);
    }
    @Override
    public List<TaskResponse> getTasksByWeek(LocalDate date) {

        // 1. Lấy user hiện tại
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Tính đầu tuần (Monday)
        LocalDate monday = date.with(java.time.DayOfWeek.MONDAY);

        // 3. Tính cuối tuần (Sunday)
        LocalDate sunday = date.with(java.time.DayOfWeek.SUNDAY);

        // 4. Convert sang LocalDateTime
        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = sunday.atTime(LocalTime.MAX);

        // 5. Query DB
        return taskRepository
                .findByUserAndDueDateBetween(user, startOfWeek, endOfWeek)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }
    @Override
    public List<TaskResponse> getTasksByMonth(LocalDate date) {

        // 1. Lấy user hiện tại
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Ngày đầu tháng
        LocalDate firstDay = date.withDayOfMonth(1);

        // 3. Ngày cuối tháng
        LocalDate lastDay = date.withDayOfMonth(date.lengthOfMonth());

        // 4. Convert sang LocalDateTime
        LocalDateTime startOfMonth = firstDay.atStartOfDay();
        LocalDateTime endOfMonth = lastDay.atTime(LocalTime.MAX);

        // 5. Query DB
        return taskRepository
                .findByUserAndDueDateBetween(user, startOfMonth, endOfMonth)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest taskRequest) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Task với ID: " + id));

        existingTask.setTitle(taskRequest.getTitle());
        existingTask.setDescription(taskRequest.getDescription());
        existingTask.setDueDate(taskRequest.getDueDate());
        if (taskRequest.getListId() != null) {
            TodoList todoList = todoListRepository.findById(taskRequest.getListId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy List với ID: " + taskRequest.getListId()));
            existingTask.setTodoList(todoList);
        } else {
            existingTask.setTodoList(null);
        }
        tagService.updateTagsForTask(taskRequest.getTagIds(), existingTask);
        subTaskService.updateSubTasksForTask(taskRequest.getSubtasks(), existingTask);
        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public TaskDetailResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Task với ID: " + id));

        // Sử dụng mapper để trả về đầy đủ thông tin tag/subtask
        return taskMapper.toDetailResponse(task);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Task với ID: " + id));

        // Task.subTasks và Task.taskTags đã có CascadeType.ALL
        // → Hibernate tự xóa sub_tasks và task_tags liên quan khi xóa Task
        taskRepository.delete(task);
    }

    @Override
    @Transactional
    public void toggleTaskStatus(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Task với ID: " + id));

        // Đảo ngược trạng thái hiện tại
        task.setCompleted(!task.isCompleted());
        taskRepository.save(task);
    }
    @Transactional
    public void toggleCompleted(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You do not have permission to modify this task");
        }

        task.setCompleted(!task.isCompleted());

    }
}