package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITodoListRepository extends JpaRepository<TodoList, Long> {
}
