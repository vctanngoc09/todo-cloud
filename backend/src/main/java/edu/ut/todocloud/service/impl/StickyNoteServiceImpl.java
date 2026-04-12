package edu.ut.todocloud.service.impl;

import edu.ut.todocloud.dto.request.StickyNoteRequest;
import edu.ut.todocloud.dto.response.StickyNoteResponse;
import edu.ut.todocloud.mapper.StickyNoteMapper;
import edu.ut.todocloud.model.StickyNote;
import edu.ut.todocloud.model.User;
import edu.ut.todocloud.repository.IStickyNoteRepository;
import edu.ut.todocloud.repository.IUserRepository;
import edu.ut.todocloud.service.IStickyNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StickyNoteServiceImpl implements IStickyNoteService {

    @Autowired
    private IStickyNoteRepository repository;

    @Autowired
    private IUserRepository userRepository;

    // FIX AN TOÀN AUTH
    private String getCurrentUsername() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Chưa đăng nhập");
        }

        String username = auth.getName();

        if (username == null || username.equals("anonymousUser")) {
            throw new RuntimeException("Chưa đăng nhập (anonymousUser)");
        }

        return username;
    }

    @Override
    public StickyNoteResponse create(StickyNoteRequest request) {

        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        StickyNote note = StickyNoteMapper.toEntity(request, user);

        return StickyNoteMapper.toResponse(repository.save(note));
    }

    @Override
    public StickyNoteResponse update(Long id, StickyNoteRequest request) {

        String username = getCurrentUsername();

        StickyNote note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // FIX SECURITY
        if (!note.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền sửa note này");
        }

        note.setTitle(request.getTitle());
        note.setText(request.getText());
        note.setColor(request.getColor());

        return StickyNoteMapper.toResponse(repository.save(note));
    }

    @Override
    public void delete(Long id) {

        String username = getCurrentUsername();

        StickyNote note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // FIX SECURITY
        if (!note.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền xóa note này");
        }

        repository.delete(note);
    }

    @Override
    public List<StickyNoteResponse> getMyNotes() {

        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return repository.findByUser(user)
                .stream()
                .map(StickyNoteMapper::toResponse)
                .collect(Collectors.toList());
    }
}