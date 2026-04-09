package edu.ut.todocloud.dto.response;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskDetailResponse {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDateTime dueDate;

    // list
    private Long listId;
    private String nameList;
    private String listColor;

    // subtask
    private List<SubTaskResponse> subTasks;

    // tag
    private List<TagResponse> tags;
}