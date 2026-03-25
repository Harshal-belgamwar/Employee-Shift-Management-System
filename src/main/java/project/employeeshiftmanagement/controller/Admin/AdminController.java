package project.employeeshiftmanagement.controller.Admin;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.employeeshiftmanagement.DTO.AdminDTO.EmployeeAdminDTO;
import project.employeeshiftmanagement.DTO.AdminDTO.EmployeeViewDTO;
import project.employeeshiftmanagement.DTO.AdminDTO.NewEmployeeDTO;
import project.employeeshiftmanagement.DTO.AdminDTO.TotalCounts;
import project.employeeshiftmanagement.DTO.LeaveRequest.ViewRequest;
import project.employeeshiftmanagement.DTO.ScheduleResponseDTO;
import project.employeeshiftmanagement.DTO.Shift.updateShift;
import project.employeeshiftmanagement.DTO.Shift.viewShift;
import project.employeeshiftmanagement.DTO.SlotDTO;
import project.employeeshiftmanagement.DTO.Users.NewPasswordDTO;
import project.employeeshiftmanagement.DTO.Users.UserDTO;
import project.employeeshiftmanagement.DTO.Users.updateUserDTO;
import project.employeeshiftmanagement.DTO.Shift.createShiftDTO;
import project.employeeshiftmanagement.DTO.ViewAllShiftRequest;
import project.employeeshiftmanagement.service.AdminService;
import project.employeeshiftmanagement.service.ScheduleService;
import project.employeeshiftmanagement.service.ShiftService;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class AdminController {

    private final AdminService adminService;
    private final ScheduleService  scheduleService;

    public AdminController(AdminService adminService, ScheduleService scheduleService) {
        this.adminService = adminService;
        this.scheduleService = scheduleService;
    }

    // List all employees
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeAdminDTO>> getAllEmployees() {
        return ResponseEntity.ok(adminService.findAll());
    }

    // Get employee details by Username
    @GetMapping("/employees/{username}")
    public ResponseEntity<EmployeeViewDTO> getEmployee(@PathVariable String username) {
        return adminService.employeeDetails(username);
    }

    // Add new employee
    @PostMapping("/employees")
    public ResponseEntity<?> addEmployee(@Valid @RequestBody NewEmployeeDTO dto) {
        return adminService.addEmployee(dto);
    }

    //add multiple employees
    @PostMapping("/multiple-employees")
    public ResponseEntity<?> addEmployees(@Valid @RequestBody List<NewEmployeeDTO> dto) {
        return adminService.addEmployees(dto);
    }

    // Update employee
    @PutMapping("/employees")
    public ResponseEntity<EmployeeViewDTO> updateEmployee(@RequestBody EmployeeViewDTO dto) {
        return adminService.updateEmployee(dto);
    }

    // Delete employee

    @DeleteMapping("/employees/{username}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String username) {
        return adminService.deleteEmployee(username);
    }

    // Create new user
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO userDTO) {
        return adminService.createUser(userDTO);
    }

    //create multiple user
    @PostMapping("/multipleusers")
    public ResponseEntity<?> createUsers(@Valid @RequestBody List<UserDTO> userDTO) {
        return adminService.createUsers(userDTO);
    }

    //view all users
    @GetMapping("/users")
    public ResponseEntity<List<updateUserDTO>> getAllUsers() {
        return adminService.viewUsers();
    }

    // for manager
    @GetMapping("/users/{username}")
    public ResponseEntity<List<updateUserDTO>> getAllUsersbyUsername(@PathVariable String username) {
        return adminService.viewNewUsers(username);
    }



    // update user details
    @PutMapping("/users/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @Valid @RequestBody updateUserDTO dto) {
        return adminService.updateUser(username , dto);
    }


    @DeleteMapping("/users/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        return adminService.deleteUser(username);
    }

    // Create new shift
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/shifts")
    public ResponseEntity<?> createShift(@Valid @RequestBody createShiftDTO dto) {
        return adminService.createShift(dto);
    }

    //update shift
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/shifts/{shiftName}")
    public ResponseEntity<?> updateShift(@Valid @PathVariable String shiftName, @Valid @RequestBody updateShift updateShift) {
        return adminService.updateShift(shiftName,updateShift);
    }

    // delete Shift
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/shifts/{shiftName}")
    public  ResponseEntity<?> deleteShift(@Valid @PathVariable String shiftName) {
        return adminService.deleteShift(shiftName);
    }

    //view all shift
    @GetMapping("/shifts")
    public List<viewShift> getAllShifts() {
        return adminService.getShift();
    }

    // change Passwrod
    @PutMapping("/users/{username}/change-password")
    public ResponseEntity<?> changePassword(@RequestBody NewPasswordDTO dto, @PathVariable String username) {
        return adminService.updatePassword(username,dto);
    }

    @PostMapping("/users/{username}/shift/{shiftname}")
    public ResponseEntity<?> updateEmployeeShift(@PathVariable String username,@PathVariable String shiftname){
        return adminService.employeeShiftUpdate(username,shiftname);
    }

    @GetMapping("/total-count")
    public TotalCounts getTotalCount(){
        return adminService.getAllCounts();
    }

    //view all leave request
    @GetMapping("/get-all-request")
    public List<ViewRequest> getAllRequest(){
        return adminService.viewAllRequest();

    }

    @GetMapping("/get-all-request/{username}")
    public List<ViewRequest> getAllRequest(@PathVariable String username){
        return adminService.viewLeaveRequest(username);

    }

    //   approve Leave request
    @PutMapping ("/leave-request/approve")
    public ResponseEntity<?> approveRequest(@Valid @RequestBody ViewRequest viewRequest){
        return adminService.approveRequest(viewRequest);
    }

    // reject leave request
    @PutMapping ("/leave-request/reject")
    public ResponseEntity<?> rejectRequest(@Valid @RequestBody ViewRequest viewRequest){
        return adminService.rejectRequest(viewRequest);
    }

    //view all shift change request
    @GetMapping("/shft-change-request")
    public List<ViewAllShiftRequest>  getShftChangeRequest(){
        return adminService.getAllShiftChangeRequest();
    }

    // view employee shift change req working under  manager
    @GetMapping("/shft-change-request/{username}")
    public List<ViewAllShiftRequest>  shftChangeRequest(@PathVariable String username){
        return adminService.getShiftChangeRequest(username);
    }

//    approve Shift change Request
    @PutMapping ("/shft-change-request/approve")
    public ResponseEntity<?> approveShiftRequest(@Valid @RequestBody ViewAllShiftRequest viewAllShiftRequest){
       return adminService.approveShiftRequest(viewAllShiftRequest);
    }

//     reject leave request
    @PutMapping ("/shft-change-request/reject")
    public ResponseEntity<?> rejectShiftRequest(@Valid @RequestBody ViewAllShiftRequest viewAllShiftRequest){
        return adminService.rejectShiftRequest(viewAllShiftRequest);
    }

    //schedule generate
    @GetMapping("/schedule-generate")
    public ScheduleResponseDTO getScheduleGenerate() {
        return adminService.generateSchedule();
    }

    @PostMapping("schedule-generate/approve/{username}")
    public ResponseEntity<?> approveScheduleGenerate(@Valid @RequestBody ScheduleResponseDTO scheduleResponseDTO,@PathVariable String username) {
        return scheduleService.approveSchedule(scheduleResponseDTO,username);
    }







}