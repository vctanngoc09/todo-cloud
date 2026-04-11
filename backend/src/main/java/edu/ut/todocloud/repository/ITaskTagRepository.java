package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.Task;
import edu.ut.todocloud.model.TaskTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITaskTagRepository extends JpaRepository<TaskTag, Long> {
    List<TaskTag> findByTask(Task task);
}
