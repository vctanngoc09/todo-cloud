package edu.ut.todocloud.repository;

import edu.ut.todocloud.model.ERole;
import edu.ut.todocloud.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}
