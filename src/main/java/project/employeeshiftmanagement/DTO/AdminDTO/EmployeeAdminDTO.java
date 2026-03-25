package project.employeeshiftmanagement.DTO.AdminDTO;

import lombok.Data;
import project.employeeshiftmanagement.Model.Roles;

import java.util.Date;

@Data
public class EmployeeAdminDTO {

    private String username;
    private int employeeId;
    private Roles role;
    private String status;
}
