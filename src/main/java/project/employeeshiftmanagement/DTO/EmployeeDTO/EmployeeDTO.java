package project.employeeshiftmanagement.DTO.EmployeeDTO;

import lombok.Data;

@Data
public class EmployeeDTO {
    private String username;
    private String role;
    private String status;

    private int id;

    private String employeeFname;
    private String employeeMname;
    private String employeeLname;
    private String employeeEmail;
    private String gender;
    private String contactNo;
    private String permanentAddress;
    private String tempAddress;
    private String designation;

    private ManagerDTO manager;
}