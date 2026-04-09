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
    private Long listId;
    private String nameList; // Thêm tên List để hiển thị
    private String listColor; // Thêm màu sắc của List
    private int subtaskCount;
    private String username;
}
