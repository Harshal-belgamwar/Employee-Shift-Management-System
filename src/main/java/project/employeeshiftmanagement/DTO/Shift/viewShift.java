package project.employeeshiftmanagement.DTO.Shift;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class viewShift {

    private String shiftName;


    private LocalTime start_time;


    private LocalTime end_time;


    private Integer slots;
}
