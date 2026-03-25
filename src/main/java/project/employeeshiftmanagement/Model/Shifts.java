package project.employeeshiftmanagement.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Shifts")
public class Shifts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Shift_Id")
    private int shift_id;

    @Column(name = "Shift_Name" , unique = true, nullable = false)
    private String shiftName;

    @Column(name = "Start_Time")
    private LocalTime start_time;

    @Column(name = "End_Time")
    private LocalTime end_time;

    @Column(name="Slots")
    private int slots;

    @Column(name="Slots_Available")
    private int slots_available = slots;

    @Column(name="Slots_Filled")
    private int slots_filled = 0;

//    @Column(name = "Status")
//    private String status;


}
