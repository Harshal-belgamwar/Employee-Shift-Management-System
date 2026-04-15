package project.employeeshiftmanagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.Employees;
import project.employeeshiftmanagement.Model.ShiftAllocation;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftAllocationRepository extends JpaRepository<ShiftAllocation, Integer> {

    List<ShiftAllocation> findByEmployee(Employees employee);

    Optional<ShiftAllocation> findByAssignmentdate(Date date);

    List<ShiftAllocation> findByEmployeeAndAllotmentType(Employees employee, String allotmentType);
}
