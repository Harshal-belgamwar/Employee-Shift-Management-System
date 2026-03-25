package project.employeeshiftmanagement.DTO.EmployeeDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ManagerDTO {
    private int id;
    private String employeeFname;
    private String employeeLname;
    private String employeeEmail;
    private String designation;
    private String contactNo;
}
