package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ITagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
}
