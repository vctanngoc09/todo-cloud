package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.StickyNote;
import edu.ut.todocloud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IStickyNoteRepository extends JpaRepository<StickyNote, Long> {
    List<StickyNote> findByUser(User user);
}