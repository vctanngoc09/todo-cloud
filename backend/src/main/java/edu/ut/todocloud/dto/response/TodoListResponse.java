package edu.ut.todocloud.dto.response;

import lombok.Data;

@Data
public class TodoListResponse {
    private Long id;
    private String nameList;
    private String color;
    private boolean active;
}
