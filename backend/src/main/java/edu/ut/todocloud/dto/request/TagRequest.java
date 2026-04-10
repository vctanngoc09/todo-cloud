package edu.ut.todocloud.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagRequest {
    private String nameTag;
    private String color;
    private Long userId;
    private boolean active;
}