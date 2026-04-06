package edu.ut.todocloud.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDateTime dueDate;
    private Long listId;    // Trả về ID thôi cho nhẹ
    private String username;
}
