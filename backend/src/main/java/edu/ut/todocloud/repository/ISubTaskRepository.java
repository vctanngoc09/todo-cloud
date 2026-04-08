package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.Role;
import edu.ut.todocloud.model.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISubTaskRepository extends JpaRepository<SubTask, Long> {
}
