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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements ITagService {

    private final ITagRepository tagRepository;
    private final IUserRepository userRepository;
    private final ITaskTagRepository taskTagRepository;

    @Override
    public List<TagResponse> getAllTagsByUserId(Long userId) {
        return tagRepository.findByUserId(userId).stream()
                .map(TagMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponse createTag(TagRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Tag tag = TagMapper.toEntity(request, user);
        return TagMapper.toResponse(tagRepository.save(tag));
    }

    @Override
    public TagResponse updateTag(Long id, TagRequest request) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        tag.setNameTag(request.getNameTag());
        tag.setColor(request.getColor());
        return TagMapper.toResponse(tagRepository.save(tag));
    }

    @Override
    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }

    // Bạn cần Autowired ITaskTagRepository vào đây
    @Override
    @Transactional
    public void assignTagsToTask(List<Long> tagIds, Task task) {
        if (tagIds == null || tagIds.isEmpty()) return;

        List<TaskTag> taskTags = tagIds.stream().map(tagId -> {
            // 1. Tìm Tag từ DB
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Tag không tồn tại: " + tagId));

            // 2. Dùng Mapper để đúc ra thực thể trung gian
            return TagMapper.toTaskTagEntity(tag, task);
        }).toList();

        // 3. Lưu hàng loạt vào bảng trung gian
        taskTagRepository.saveAll(taskTags);
    }
}