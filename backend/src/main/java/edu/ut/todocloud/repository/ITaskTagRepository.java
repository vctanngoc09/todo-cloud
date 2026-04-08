package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.TaskTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaskTagRepository extends JpaRepository<TaskTag, Long> {
}
