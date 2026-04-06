package edu.ut.todocloud.dto.request;


import java.time.LocalDateTime;
import java.time.LocalTime;

public class TaskRequest {
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Long listId;

    public TaskRequest(String title, String description, LocalDateTime dueDate, Long listId) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.listId = listId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public Long getListId() {
        return listId;
    }

    public void setListId(Long listId) {
        this.listId = listId;
    }
}
