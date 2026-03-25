package project.employeeshiftmanagement.DTO.Shift;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class updateShift {

    @NotBlank(message = "Shift name is required")
    private String shiftName;

    @NotNull(message = "Start time is required")
    private LocalTime start_time;

    @NotNull(message = "End time is required")
    private LocalTime end_time;

    @Min(value = 1, message = "Slots must be at least 1")
    private Integer slots;
}
