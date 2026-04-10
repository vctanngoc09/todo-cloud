package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.TagRequest;
import edu.ut.todocloud.dto.response.TagResponse;
import edu.ut.todocloud.model.Tag;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.model.TaskTag;
import edu.ut.todocloud.model.User;

public class TagMapper {

    public static TagResponse toResponse(Tag tag) {
        if (tag == null) return null;

        return TagResponse.builder()
                .id(tag.getId())
                .nameTag(tag.getNameTag())
                .color(tag.getColor())
                .active(tag.isActive())
                .build();
    }

    public static Tag toEntity(TagRequest request, User user) {
        if (request == null) return null;

        Tag tag = new Tag();
        tag.setNameTag(request.getNameTag());
        tag.setColor(request.getColor());
        tag.setUser(user);
        tag.setActive(request.isActive());

        return tag;
    }

    public static TaskTag toTaskTagEntity(Tag tag, Task task) {
        if (tag == null || task == null) return null;

        TaskTag taskTag = new TaskTag();
        taskTag.setTag(tag);
        taskTag.setTask(task);

        return taskTag;
    }
}