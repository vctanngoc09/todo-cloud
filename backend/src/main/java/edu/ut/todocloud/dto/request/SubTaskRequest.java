package edu.ut.todocloud.dto.request;

import lombok.Data;

@Data
public class SubTaskRequest {
    private String title;
    private Long taskId;
}
