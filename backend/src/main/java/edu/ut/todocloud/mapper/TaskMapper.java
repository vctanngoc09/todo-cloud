package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.TaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;
import edu.ut.todocloud.dto.response.TagResponse;
import edu.ut.todocloud.dto.response.TaskDetailResponse;
import edu.ut.todocloud.dto.response.TaskResponse;
import edu.ut.todocloud.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

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
    public TaskDetailResponse toDetailResponse(Task task) {
        if (task == null) return null;

        TaskDetailResponse res = new TaskDetailResponse();

        res.setId(task.getId());
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setCompleted(task.isCompleted());
        res.setDueDate(task.getDueDate());

        // list
        if (task.getTodoList() != null) {
            res.setListId(task.getTodoList().getId());
            res.setNameList(task.getTodoList().getNameList());
            res.setListColor(task.getTodoList().getColor());
        }

        // subTasks (tránh null)
        res.setSubTasks(
                task.getSubTasks() != null
                        ? task.getSubTasks().stream().map(sub -> {
                    SubTaskResponse s = new SubTaskResponse();
                    s.setId(sub.getId());
                    s.setTitle(sub.getTitle());
                    s.setCompleted(sub.isCompleted());
                    return s;
                }).toList()
                        : List.of()
        );

        // tags (tránh null + tránh lỗi tag null)
        res.setTags(
                task.getTaskTags() != null
                        ? task.getTaskTags().stream()
                        .map(TaskTag::getTag)
                        .filter(Objects::nonNull)
                        .map(tag -> {
                            TagResponse t = new TagResponse();
                            t.setId(tag.getId());
                            t.setNameTag(tag.getNameTag());
                            t.setColor(tag.getColor());
                            return t;
                        }).toList()
                        : List.of()
        );

        return res;
    }
}
