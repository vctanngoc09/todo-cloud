package edu.ut.todocloud.dto.request;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagRequest {
    private String nameTag;
    private String color;
    private Long userId;
}