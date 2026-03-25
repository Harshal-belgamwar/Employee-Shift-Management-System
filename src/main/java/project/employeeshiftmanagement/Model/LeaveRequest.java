package project.employeeshiftmanagement.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "LeaveRequest")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LeaveRequest_Id")
    private int leave_id;

    @ManyToOne
    @JoinColumn(name = "Employee_Id",nullable = false)
    private Employees employee;

    @Column(name = "Start_Date")
    private Date start_date;

    @Column(name = "End_Date")
    private Date end_date;

    @Column(name = "Reason")
    private String reason;


    @Column(name = "Status")
    private String status;


    @Column(name="Request_Time")
    private LocalDateTime requested_at;

}
