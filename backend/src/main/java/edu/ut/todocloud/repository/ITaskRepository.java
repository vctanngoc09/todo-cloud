package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ITaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserAndDueDateBetween(User user, LocalDateTime start, LocalDateTime end);

}
