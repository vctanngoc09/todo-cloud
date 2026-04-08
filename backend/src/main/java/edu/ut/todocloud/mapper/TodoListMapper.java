package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.TodoListRequest;
import edu.ut.todocloud.dto.response.TodoListResponse;
import edu.ut.todocloud.model.TodoList;
import edu.ut.todocloud.model.User;
import org.springframework.stereotype.Component;

@Component
public class TodoListMapper {

    public TodoList toEntity(TodoListRequest request, User user) {
        if (request == null) return null;
        TodoList todoList = new TodoList();
        todoList.setNameList(request.getNameList());
        todoList.setColor(request.getColor());
        todoList.setUser(user); // Gán chủ sở hữu cho List
        return todoList;
    }

    public TodoListResponse toResponse(TodoList todoList) {
        if (todoList == null) return null;
        TodoListResponse response = new TodoListResponse();
        response.setId(todoList.getId());
        response.setNameList(todoList.getNameList());
        response.setColor(todoList.getColor());
        return response;
    }
}