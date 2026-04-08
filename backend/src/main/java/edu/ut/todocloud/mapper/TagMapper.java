package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.TagRequest;
import edu.ut.todocloud.dto.response.TagResponse;
import edu.ut.todocloud.model.Tag;
import edu.ut.todocloud.model.User;

public class TagMapper {

    public static TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .nameTag(tag.getNameTag())
                .color(tag.getColor())
                .build();
    }

    public static Tag toEntity(TagRequest request, User user) {
        Tag tag = new Tag();
        tag.setNameTag(request.getNameTag());
        tag.setColor(request.getColor());
        tag.setUser(user);
        return tag;
    }
}