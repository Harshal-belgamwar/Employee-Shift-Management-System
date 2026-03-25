package project.employeeshiftmanagement.DTO.LeaveRequest;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequestDTO {

    private Date start_date;


    private Date end_date;


    private String reason;


}
