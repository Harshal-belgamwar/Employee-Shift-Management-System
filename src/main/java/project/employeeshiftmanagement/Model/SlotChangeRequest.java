package project.employeeshiftmanagement.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "SlotChangeRequest")
public class SlotChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_change_id")
    private Integer slotChangeId;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employees employee;

    @Column(name = "shift_change_date")
    private Date shiftChangeDate;

    @ManyToOne
    @JoinColumn(name = "shift_id", nullable = false)
    private Shifts preferredShift;

    @Column(name = "status")
    private String status;

    @Column(name="reason")
    private String reason;

    @Column(name = "requested_at")
    private Date requestedAt;

}
