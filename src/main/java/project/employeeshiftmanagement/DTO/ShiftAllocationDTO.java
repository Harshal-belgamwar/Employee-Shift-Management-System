package project.employeeshiftmanagement.DTO;

import lombok.Data;

import java.time.LocalTime;
import java.util.Date;

@Data
public class ShiftAllocationDTO {


    private String shiftName;
    private LocalTime startTime;
    private LocalTime endTime;

}
