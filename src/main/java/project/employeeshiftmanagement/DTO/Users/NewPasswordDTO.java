package project.employeeshiftmanagement.DTO.Users;

import lombok.Data;

@Data
public class NewPasswordDTO {

    private String newPassword;

    private String confirmPassword;
}
