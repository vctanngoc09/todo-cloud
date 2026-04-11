package edu.ut.todocloud.dto.request;

import lombok.Data;

@Data
public class SubTaskRequest {
    private Long id;
    private String title;
    private Long taskId;
    private boolean completed;
}
