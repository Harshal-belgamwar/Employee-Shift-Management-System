package project.employeeshiftmanagement.DTO.Users;

import lombok.Data;
import project.employeeshiftmanagement.Model.Roles;

@Data
public class UserDTO {

    public String username;
    public String email;
    public String password;

    public Roles role;



}
