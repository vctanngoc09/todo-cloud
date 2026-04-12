package edu.ut.todocloud.dto.request;

import lombok.Data;

@Data
public class TodoListRequest {
    private String nameList;
    private String color;
    private boolean active;
}
