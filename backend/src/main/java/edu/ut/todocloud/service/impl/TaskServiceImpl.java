package edu.ut.todocloud.service.impl;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.mapper.TaskMapper;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.model.TodoList;
import edu.ut.todocloud.model.User;
import edu.ut.todocloud.repository.ITaskRepository;
import edu.ut.todocloud.repository.ITodoListRepository;
import edu.ut.todocloud.repository.IUserRepository;
import edu.ut.todocloud.service.ITaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements ITaskService {

    @Autowired
    private ITaskRepository taskRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ITodoListRepository todoListRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Override
    public Task createTask(TaskRequest taskRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3. Nếu có listId, tìm và gán TodoList vào Task
        TodoList todoList = null;
        if (taskRequest.getListId() != null) {
            todoList = todoListRepository.findById(taskRequest.getListId())
                    .orElse(null);
        }

        Task task = taskMapper.toEntity(taskRequest, user, todoList);

        return taskRepository.save(task);
    }
}
