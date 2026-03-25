package project.employeeshiftmanagement.DTO.EmployeeDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ShiftPreferenceDTO {

    private String username;
    private String preference1;
    private String preference2;
    private LocalDateTime submittedAt;
    private String status;

}