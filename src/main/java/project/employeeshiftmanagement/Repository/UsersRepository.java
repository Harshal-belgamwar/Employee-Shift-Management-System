package project.employeeshiftmanagement.Repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.Employees;
import project.employeeshiftmanagement.Model.Users;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users,Integer> {
    Optional<Users> findByUsername(String username);

    boolean existsByUsername(String username);
//    Optional<Users> findByEmail(String email);

    Optional<Users> findByEmployee(Employees employee);
    boolean existsByEmployee(Employees employee);

    void deleteByUsername(String username);
}
