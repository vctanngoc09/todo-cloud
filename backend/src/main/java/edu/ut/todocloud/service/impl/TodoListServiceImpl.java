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
    public List<TodoListResponse> getAllMyListsActive() {
        // 1. Lấy thông tin User đang đăng nhập
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Lấy danh sách List từ DB
        List<TodoList> lists = todoListRepository.findByUserAndActiveTrue(user);

        // 3. Chuyển đổi danh sách Entity sang danh sách Response DTO
        return lists.stream()
                .map(todoListMapper::toResponse)
                .collect(Collectors.toList());
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


    @Override
    public void deleteList(Long listId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        TodoList todoList = todoListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        // Kiểm tra xem user hiện tại có phải chủ sở hữu không
        if (!todoList.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this list");
        }

        todoList.setActive(false); // Chuyển trạng thái thay vì xóa khỏi DB
        todoListRepository.save(todoList);
    }

    @Override
    public TodoListResponse updateList(Long listId, TodoListRequest request) {
        // 1. Lấy thông tin User đang đăng nhập để bảo mật
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Tìm List hiện tại trong DB
        TodoList todoList = todoListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));

        // 3. Kiểm tra quyền: Chỉ chủ sở hữu mới được sửa
        if (!todoList.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to update this list");
        }

        // 4. Cập nhật các thông tin mới
        todoList.setNameList(request.getNameList());
        todoList.setColor(request.getColor());
        todoList.setActive(request.isActive());

        // Lưu ý: Nếu bạn muốn cho phép cập nhật cả trạng thái active qua API này,
        // bạn có thể thêm thuộc tính active vào TodoListRequest và set tại đây.

        // 5. Lưu và trả về kết quả
        TodoList updatedList = todoListRepository.save(todoList);
        return todoListMapper.toResponse(updatedList);
    }
}