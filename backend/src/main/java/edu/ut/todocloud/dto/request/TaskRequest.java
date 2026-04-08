package edu.ut.todocloud.dto.request;


import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class TaskRequest {
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Long listId;
    private List<String> subtasks;
    private List<Long> tagIds;

    public TaskRequest(String title, String description, LocalDateTime dueDate, Long listId, List<String> subtasks, List<Long> tagIds) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.listId = listId;
        this.subtasks = subtasks;
        this.tagIds = tagIds;
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

    public List<String> getSubtasks() {
        return subtasks;
    }

    public void setSubtasks(List<String> subtasks) {
        this.subtasks = subtasks;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }
}
