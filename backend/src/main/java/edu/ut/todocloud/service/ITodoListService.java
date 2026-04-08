package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.TodoListRequest;
import edu.ut.todocloud.dto.response.TodoListResponse;

import java.util.List;

public interface ITodoListService {
    TodoListResponse createList(TodoListRequest request);
    List<TodoListResponse> getAllMyLists();
}
