package project.employeeshiftmanagement.DTO.AdminDTO;

import lombok.Data;

import java.util.Date;

@Data
public class NewEmployeeDTO {

    private String managerUsername;


    private String employeeFname;
    private String employeeMname;
    private String employeeLname;
    private String employeeEmail;
    private String gender;
    private String contactNo;
    private String permanentAddress;
    private String tempAddress;
    private String designation;

    private Date joinDate;
    private Date endDate;
}
