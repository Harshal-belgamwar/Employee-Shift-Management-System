package project.employeeshiftmanagement.controller.Employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.employeeshiftmanagement.DTO.EmployeeDTO.EmployeeDTO;
import project.employeeshiftmanagement.DTO.LeaveRequest.LeaveRequestDTO;
import project.employeeshiftmanagement.DTO.LeaveRequest.ViewRequest;
import project.employeeshiftmanagement.DTO.EmployeeDTO.ShiftPreferenceDTO;
import project.employeeshiftmanagement.DTO.ShiftAllocationDTO;
import project.employeeshiftmanagement.DTO.SlotDTO;
import project.employeeshiftmanagement.DTO.Users.NewPasswordDTO;
import project.employeeshiftmanagement.DTO.ViewAllShiftRequest;
import project.employeeshiftmanagement.Model.Notification;
import project.employeeshiftmanagement.service.EmployeeService;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/employee")
@PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER')")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // ================= 1. Get logged-in employee =================
    @GetMapping("/profile/{username}")
    public EmployeeDTO getProfile(@PathVariable String username) {
        return employeeService.getEmployees(username);
    }



    // ================= 2. Update employee details =================
    @PutMapping("/update/{username}")
    public EmployeeDTO updateDetails(@RequestBody EmployeeDTO employeeDTO,@PathVariable String username) {
        return employeeService.updateDetails(username , employeeDTO);
    }

    // ================= 3. Change password =================
    @PutMapping("/change-password/{username}")
    public ResponseEntity<?> changePassword(@RequestBody NewPasswordDTO  newPasswordDTO ,@PathVariable String username) {
        return employeeService.changePassword(newPasswordDTO,username);
    }

    // ================= 4. Leave request =================
    @PostMapping("/leave-request/{username}")
    public ResponseEntity<?> leaveRequest(@RequestBody LeaveRequestDTO leaveRequestDTO,@PathVariable String username) {
        return employeeService.leaveRequest(username,leaveRequestDTO);
    }

    @GetMapping("/leave-request/{username}")
    public List<ViewRequest> viewLeaveRequest(@PathVariable String username) {
        return employeeService.viewAllLeaveRequests(username);
    }

    // ================= 5. Shift change request =================
    @PostMapping("/shift-change-request/{username}")
    public ResponseEntity<?> shiftChangeRequest(@RequestBody SlotDTO slotDTO,@PathVariable String username) {
        return employeeService.shiftChangeRequest(username,slotDTO);
    }

    @GetMapping("/shifts")
    public ResponseEntity<?> getAllShifts() {
        return employeeService.getAllShifts();
    }

    @GetMapping("/shift-request/{username}")
    public List<ViewAllShiftRequest> getShiftRequest(@PathVariable String username) {
        return employeeService.viewAllShiftRequests(username);
    }

    @GetMapping("/notification/{username}")
    public List<Notification> getNotifications(@PathVariable String username) {
        return employeeService.getAllNotification(username);
    }

    @PostMapping("/shift-preference")
    public ResponseEntity<?> saveShiftPreference(@RequestBody ShiftPreferenceDTO shiftPreferenceDTO) {
        return employeeService.submitPreference(shiftPreferenceDTO);
    }

    @GetMapping("/shift-preference/{username}")
    public List<ShiftPreferenceDTO> getShiftPreference(@PathVariable String username) {
        return employeeService.viewAllShiftPreferences(username);
    }

    @GetMapping("/shift-assign/{username}/{date}")
    public ShiftAllocationDTO  getShiftAllocation(@PathVariable String username, @PathVariable LocalDate date) {
        return employeeService.getShiftAllocation(username,date);
    }






}