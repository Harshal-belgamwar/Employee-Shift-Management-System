package project.employeeshiftmanagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.Employees;
import project.employeeshiftmanagement.Model.LeaveRequest;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {
    List<LeaveRequest> findByEmployee(Employees employee);


    List<LeaveRequest> findByStatus(String pending);

    List<LeaveRequest> findByEmployee_Manager(Employees employee);
}
