package project.employeeshiftmanagement.controller.Manager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.employeeshiftmanagement.Model.Employees;
import project.employeeshiftmanagement.service.EmployeeService;
import project.employeeshiftmanagement.service.ManagerService;

@RestController
@RequestMapping("/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    ManagerService managerService;
    @Autowired
    public void setEmployeeService(ManagerService managerService) {
        this.managerService = managerService;
    }

    // 1. add Employee
    @PostMapping("/add")
    public ResponseEntity<Employees> addEmployee(@RequestBody Employees employee) {
        Employees savedEmployee = managerService.addEmployee(employee);
        return ResponseEntity.ok(savedEmployee);
    }

}
