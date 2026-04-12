package edu.ut.todocloud.dto.request;

import lombok.Data;

@Data
public class StickyNoteRequest {
    private String title;
    private String text;
    private String color;
}
