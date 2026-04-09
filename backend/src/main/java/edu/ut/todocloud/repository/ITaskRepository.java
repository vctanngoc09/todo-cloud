package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ITaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByUserAndDueDateBetween(User user, LocalDateTime start, LocalDateTime end);
}
