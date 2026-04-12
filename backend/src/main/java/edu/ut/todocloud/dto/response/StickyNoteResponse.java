package edu.ut.todocloud.dto.response;

import lombok.Data;

@Data
public class StickyNoteResponse {
    private Long id;
    private String title;
    private String text;
    private String color;
}