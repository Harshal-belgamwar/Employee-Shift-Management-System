package project.employeeshiftmanagement.DTO.Users;

import lombok.Data;
import project.employeeshiftmanagement.Model.Roles;

@Data
public class updateUserDTO {

    private String username;           // maps to username
    private Roles role;                // maps to role
    private String password;
    private String status;

}
