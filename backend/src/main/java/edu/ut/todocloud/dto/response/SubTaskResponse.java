package edu.ut.todocloud.dto.response;

import lombok.Data;

@Data
public class SubTaskResponse {
    private Long id;
    private String title;
    private boolean completed;
    private Long taskId;
}
