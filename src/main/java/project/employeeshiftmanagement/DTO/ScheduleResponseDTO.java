package project.employeeshiftmanagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleResponseDTO {

    private List<scheduleAssignDTO> scheduleAssignDTOList;
    private HashMap<String,Integer> remainingSlots;
}
