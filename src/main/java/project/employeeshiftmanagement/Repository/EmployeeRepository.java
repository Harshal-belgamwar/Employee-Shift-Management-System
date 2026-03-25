package project.employeeshiftmanagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import project.employeeshiftmanagement.Model.Employees;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employees, Integer> {


    List<Employees> findByStatus(String status);
    List<Employees> findByManager(Employees manager);
    Optional<Employees> findByEmployeeEmail(String email);

}
