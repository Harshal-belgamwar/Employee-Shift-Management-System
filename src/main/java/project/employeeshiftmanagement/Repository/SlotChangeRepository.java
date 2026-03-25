package project.employeeshiftmanagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.Employees;
import project.employeeshiftmanagement.Model.SlotChangeRequest;

import java.util.List;

@Repository
public interface SlotChangeRepository extends JpaRepository<SlotChangeRequest, Integer> {


    List<SlotChangeRequest> findByEmployee(Employees employee);



    List<SlotChangeRequest> findByEmployee_Manager(Employees employee);

    SlotChangeRequest findBySlotChangeId(int id);
}
