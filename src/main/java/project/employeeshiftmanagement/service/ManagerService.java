package project.employeeshiftmanagement.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.employeeshiftmanagement.Model.Employees;
import project.employeeshiftmanagement.Repository.EmployeeRepository;

@Service
@Transactional
public class ManagerService {

    EmployeeRepository employeeRepository;

    @Autowired
    public ManagerService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employees addEmployee(Employees employee) {

        return employeeRepository.save(employee);
    }
}
