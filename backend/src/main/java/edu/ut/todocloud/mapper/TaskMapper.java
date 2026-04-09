package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.TaskResponse;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.model.TodoList;
import edu.ut.todocloud.model.User;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {
    public Task toEntity(TaskRequest taskRequest, User user, TodoList todoList) {
        if (taskRequest == null) return null;

        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setCompleted(false); // Mặc định task mới là chưa xong

        // Gán các quan hệ Entity
        task.setUser(user);
        task.setTodoList(todoList);

        return task;
    }

    public TaskResponse toResponse(Task task) {
        if (task == null) return null;

        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setCompleted(task.isCompleted());
        response.setDueDate(task.getDueDate());

        if (task.getTodoList() != null) {
            response.setListId(task.getTodoList().getId());
            response.setNameList(task.getTodoList().getNameList());
            response.setListColor(task.getTodoList().getColor());
        }

        if (task.getUser() != null) {
            response.setUsername(task.getUser().getUsername());
        }

        if (task.getSubTasks() != null) {
            response.setSubtaskCount(task.getSubTasks().size());
        }

        return response;
    }
}
