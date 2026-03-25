package project.employeeshiftmanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class scheduleAssignDTO {

    private int preferenceRequestId;
    private String username;
    private String shiftname;
    private LocalDate assignmentDate;




}
