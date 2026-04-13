package edu.ut.todocloud.service.impl;

import edu.ut.todocloud.dto.request.TagRequest;
import edu.ut.todocloud.dto.response.TagResponse;
import edu.ut.todocloud.mapper.TagMapper;
import edu.ut.todocloud.model.Tag;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.model.TaskTag;
import edu.ut.todocloud.model.User;
import edu.ut.todocloud.repository.ITagRepository;
import edu.ut.todocloud.repository.ITaskTagRepository;
import edu.ut.todocloud.repository.IUserRepository;
import edu.ut.todocloud.service.ITagService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements ITagService {

    private final ITagRepository tagRepository;
    private final IUserRepository userRepository;
    private final ITaskTagRepository taskTagRepository;

    // ================= HELPER =================

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private void validateTagOwnership(Tag tag, User user) {
        if (!tag.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền thao tác tag này");
        }
    }

    // ================= CRUD =================

    @Override
    public List<TagResponse> getAllTagsByUserId(Long userId) {
        return tagRepository.findByUserId(userId).stream()
                .map(TagMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponse createTag(TagRequest request) {
        User user = getCurrentUser();

        Tag tag = TagMapper.toEntity(request, user);
        return TagMapper.toResponse(tagRepository.save(tag));
    }

    @Override
    public TagResponse updateTag(Long id, TagRequest request) {
        User user = getCurrentUser();

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        validateTagOwnership(tag, user);

        tag.setNameTag(request.getNameTag());
        tag.setColor(request.getColor());
        tag.setActive(request.isActive());

        return TagMapper.toResponse(tagRepository.save(tag));
    }

    @Override
    public void deleteTag(Long id) {
        User user = getCurrentUser();

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        validateTagOwnership(tag, user);

        tagRepository.delete(tag);
    }

    // ================= TAG - TASK =================

    @Override
    @Transactional
    public void assignTagsToTask(List<Long> tagIds, Task task) {
        if (tagIds == null || tagIds.isEmpty()) return;

        User user = getCurrentUser();

        List<TaskTag> taskTags = tagIds.stream().map(tagId -> {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Tag không tồn tại: " + tagId));

            validateTagOwnership(tag, user);

            return TagMapper.toTaskTagEntity(tag, task);
        }).toList();

        taskTagRepository.saveAll(taskTags);
    }

    @Override
    public List<TagResponse> getActiveTagsByUserId(Long userId) {
        return tagRepository.findByUserIdAndActiveTrue(userId).stream()
                .map(TagMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateTagsForTask(List<Long> newTagIds, Task task) {
        User user = getCurrentUser();

        List<TaskTag> currentTaskTags = taskTagRepository.findByTask(task);

        if (newTagIds == null || newTagIds.isEmpty()) {
            taskTagRepository.deleteAll(currentTaskTags);
            return;
        }

        Set<Long> newTagIdSet = new HashSet<>(newTagIds);

        // Tags cần xóa
        List<TaskTag> tagsToRemove = currentTaskTags.stream()
                .filter(tt -> !newTagIdSet.contains(tt.getTag().getId()))
                .collect(Collectors.toList());

        // Tags đã tồn tại
        Set<Long> existingTagIds = currentTaskTags.stream()
                .map(tt -> tt.getTag().getId())
                .collect(Collectors.toSet());

        // Tags cần thêm
        List<TaskTag> tagsToAdd = newTagIds.stream()
                .filter(tagId -> !existingTagIds.contains(tagId))
                .map(tagId -> {
                    Tag tag = tagRepository.findById(tagId)
                            .orElseThrow(() -> new RuntimeException("Tag không tồn tại: " + tagId));

                    validateTagOwnership(tag, user);

                    return TagMapper.toTaskTagEntity(tag, task);
                })
                .collect(Collectors.toList());

        if (!tagsToRemove.isEmpty()) {
            taskTagRepository.deleteAll(tagsToRemove);
        }

        if (!tagsToAdd.isEmpty()) {
            taskTagRepository.saveAll(tagsToAdd);
        }
    }
}