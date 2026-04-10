package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.TagRequest;
import edu.ut.todocloud.dto.response.TagResponse;
import edu.ut.todocloud.model.Task;

import java.util.List;

public interface ITagService {
    List<TagResponse> getAllTagsByUserId(Long userId);
    TagResponse createTag(TagRequest request);
    TagResponse updateTag(Long id, TagRequest request);
    void deleteTag(Long id);
    void assignTagsToTask(List<Long> tagIds, Task task);
    List<TagResponse> getActiveTagsByUserId(Long userId);
}