package edu.ut.todocloud.service.impl;

import java.util.stream.Collectors;
import java.util.Set;
import java.util.Objects;
import edu.ut.todocloud.dto.request.SubTaskRequest;
import edu.ut.todocloud.dto.response.SubTaskResponse;
import edu.ut.todocloud.mapper.SubTaskMapper;
import edu.ut.todocloud.model.SubTask;
import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.repository.ISubTaskRepository;
import edu.ut.todocloud.repository.ITaskRepository;
import edu.ut.todocloud.service.ISubTaskService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubTaskServiceImpl implements ISubTaskService {

    @Autowired
    private ISubTaskRepository subTaskRepository;

    @Autowired
    private ITaskRepository taskRepository;

    @Autowired
    private SubTaskMapper subTaskMapper;

    @Override
    public SubTaskResponse createSubTask(SubTaskRequest request) {
        // 1. Tìm Task cha
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Task cha với ID: " + request.getTaskId()));

        // 2. Chuyển DTO sang Entity và lưu
        SubTask subTask = subTaskMapper.toEntity(request, task);
        SubTask savedSubTask = subTaskRepository.save(subTask);

        // 3. Trả về DTO Response để tránh vòng lặp JSON
        return subTaskMapper.toResponse(savedSubTask);
    }

    @Override
    @Transactional
    public void saveAllSubTasks(List<SubTaskRequest> subTaskRequests, Task task) {
        if (subTaskRequests == null || subTaskRequests.isEmpty()) return;

        List<SubTask> subTaskList = subTaskRequests.stream()
                .map(req -> {
                    SubTask subTask = subTaskMapper.toEntity(req, task);
                    // Đảm bảo gán task cha để có ID khóa ngoại
                    subTask.setTask(task);
                    return subTask;
                })
                .toList();

        subTaskRepository.saveAll(subTaskList);
    }

    @Override
    @Transactional
    public void updateSubTasksForTask(List<SubTaskRequest> subTaskRequests, Task task) {
        // 1. Lấy danh sách subtasks hiện tại của Task từ DB
        List<SubTask> currentSubTasks = task.getSubTasks();

        // 2. Nếu request rỗng -> Xóa tất cả subtasks của task này
        if (subTaskRequests == null || subTaskRequests.isEmpty()) {
            if (currentSubTasks != null && !currentSubTasks.isEmpty()) {
                subTaskRepository.deleteAll(currentSubTasks);
            }
            return;
        }

        // 3. Xác định các SubTask cần XÓA
        // (Những cái có trong DB nhưng ID không xuất hiện trong danh sách gửi lên)
        Set<Long> requestIds = subTaskRequests.stream()
                .map(SubTaskRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet()); // Sử dụng Collectors sau khi đã import

        List<SubTask> toRemove = currentSubTasks.stream()
                .filter(sub -> !requestIds.contains(sub.getId()))
                .collect(Collectors.toList());

        if (!toRemove.isEmpty()) {
            subTaskRepository.deleteAll(toRemove);
        }

        // 4. Xử lý CẬP NHẬT hoặc THÊM MỚI
        for (SubTaskRequest req : subTaskRequests) {
            if (req.getId() != null) {
                // Trường hợp CẬP NHẬT: Tìm subtask cũ trong list để update thông tin
                currentSubTasks.stream()
                        .filter(sub -> sub.getId().equals(req.getId()))
                        .findFirst()
                        .ifPresent(sub -> {
                            sub.setTitle(req.getTitle());
                            sub.setCompleted(req.isCompleted());
                            subTaskRepository.save(sub);
                        });
            } else {
                // Trường hợp THÊM MỚI: id == null
                SubTask newSub = subTaskMapper.toEntity(req, task);
                subTaskRepository.save(newSub);
            }
        }
    }
}
