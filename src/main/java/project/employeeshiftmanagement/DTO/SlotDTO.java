package project.employeeshiftmanagement.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class SlotDTO {

    private String username;

    private Date shiftChangeDate;

    private String preferredShift;

    private String reason;

}
