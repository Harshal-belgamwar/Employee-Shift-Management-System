package project.employeeshiftmanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewAllShiftRequest {

    private String username;
    private int id ;

    private Date shiftChangeDate;

    private String preferredShift;

    private String status;

    private String reason;

    private Date requestedAt;
}
