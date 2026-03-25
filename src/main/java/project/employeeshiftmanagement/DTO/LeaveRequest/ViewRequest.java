package project.employeeshiftmanagement.DTO.LeaveRequest;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViewRequest {
    private int leave_id;
    private String username;
    private Date start_date;
    private Date end_date;
    private String reason;
    private String status;
    private LocalDateTime requested_at;


}
