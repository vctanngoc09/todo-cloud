package edu.ut.todocloud.service.impl;

import edu.ut.todocloud.dto.request.TodoListRequest;
import edu.ut.todocloud.dto.response.TodoListResponse;
import edu.ut.todocloud.mapper.TodoListMapper;
import edu.ut.todocloud.model.TodoList;
import edu.ut.todocloud.model.User;
import edu.ut.todocloud.repository.ITodoListRepository;
import edu.ut.todocloud.repository.IUserRepository;
import edu.ut.todocloud.service.ITodoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoListServiceImpl implements ITodoListService {

    @Autowired
    private ITodoListRepository todoListRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private TodoListMapper todoListMapper;

    @Override
    public TodoListResponse createList(TodoListRequest request) {
        // Lấy User từ Token đã xác thực
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Chuyển sang Entity và lưu
        TodoList todoList = todoListMapper.toEntity(request, user);
        TodoList savedList = todoListRepository.save(todoList);

        return todoListMapper.toResponse(savedList);
    }

    @Override
    public List<TodoListResponse> getAllMyLists() {
        // 1. Lấy thông tin User đang đăng nhập
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Lấy danh sách List từ DB
        List<TodoList> lists = todoListRepository.findByUser(user);

        // 3. Chuyển đổi danh sách Entity sang danh sách Response DTO
        return lists.stream()
                .map(todoListMapper::toResponse)
                .collect(Collectors.toList());
    }
}
