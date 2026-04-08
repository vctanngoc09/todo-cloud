package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.TodoList;
import edu.ut.todocloud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITodoListRepository extends JpaRepository<TodoList, Long> {
    List<TodoList> findByUser(User user);
}
