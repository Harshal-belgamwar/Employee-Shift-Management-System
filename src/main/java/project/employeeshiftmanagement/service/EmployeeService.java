package project.employeeshiftmanagement.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.employeeshiftmanagement.DTO.EmployeeDTO.EmployeeDTO;
import project.employeeshiftmanagement.DTO.EmployeeDTO.ManagerDTO;
import project.employeeshiftmanagement.DTO.ErrorResponse;
import project.employeeshiftmanagement.DTO.LeaveRequest.LeaveRequestDTO;
import project.employeeshiftmanagement.DTO.LeaveRequest.ViewRequest;
import project.employeeshiftmanagement.DTO.EmployeeDTO.ShiftPreferenceDTO;
import project.employeeshiftmanagement.DTO.ShiftAllocationDTO;
import project.employeeshiftmanagement.DTO.SlotDTO;
import project.employeeshiftmanagement.DTO.Users.NewPasswordDTO;
import project.employeeshiftmanagement.DTO.ViewAllShiftRequest;
import project.employeeshiftmanagement.Exception.EmployeeNotFound;
import project.employeeshiftmanagement.Exception.ShiftNotFound;
import project.employeeshiftmanagement.Exception.UserNotFound;
import project.employeeshiftmanagement.Model.*;
import project.employeeshiftmanagement.Model.ShiftPreference;
import project.employeeshiftmanagement.Repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;


@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final ShiftAllocationRepository shiftAllocationRepository;
    private final UsersRepository usersRepository;
    private final SlotChangeRepository slotChangeRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final ShiftsRepository shiftsRepository;
    private final NotificationRepository notificationRepository;
    private final ShiftPreferenceRepository shiftPreferenceRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository,
                           LeaveRequestRepository leaveRequestRepository,
                           ShiftAllocationRepository shiftAllocationRepository,
                           ShiftsRepository shiftsRepository,
                           UsersRepository usersRepository,
                           SlotChangeRepository slotChangeRepository,
                           PasswordEncoder passwordEncoder,
                           ModelMapper modelMapper, NotificationRepository notificationRepository, ShiftPreferenceRepository shiftPreference, ShiftPreferenceRepository shiftPreferenceRepository) {

        this.employeeRepository = employeeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.shiftAllocationRepository = shiftAllocationRepository;
        this.usersRepository = usersRepository;
        this.slotChangeRepository = slotChangeRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
        this.shiftsRepository = shiftsRepository;
        this.notificationRepository = notificationRepository;

        this.shiftPreferenceRepository = shiftPreferenceRepository;
    }

//    helper
    public Date addOneMonth(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, 1);
        return cal.getTime();
    }

    // ================= COMMON =================

    private Employees getEmployeeByUsername(String username) {

        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("User not found"));

        Employees employee = user.getEmployee();

        if (employee == null) {
            throw new EmployeeNotFound("Employee not linked to user");
        }

        return employee;
    }

    // ================= UPDATE DETAILS =================

    public EmployeeDTO updateDetails(String username, EmployeeDTO employeeDTO) {

        Employees emp = getEmployeeByUsername(username);

        emp.setContactNo(employeeDTO.getContactNo());
        emp.setTempAddress(employeeDTO.getTempAddress());
        emp.setPermanentAddress(employeeDTO.getPermanentAddress());
        emp.setGender(employeeDTO.getGender());

        return modelMapper.map(employeeRepository.save(emp), EmployeeDTO.class);
    }

    // ================= CHANGE PASSWORD =================

    public ResponseEntity<?> changePassword(NewPasswordDTO dto, String username) {

        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("User not found"));

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            return new ResponseEntity<>(new ErrorResponse("new password and Confirm password do not match!",HttpStatus.BAD_REQUEST),HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setChange_password(true);

        usersRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Password changed successfully",
                        "username", user.getUsername()
                )
        );
    }

    // ================= LEAVE REQUEST =================

    public ResponseEntity<?> leaveRequest(String username, LeaveRequestDTO dto) {

        Employees emp = getEmployeeByUsername(username);

        LeaveRequest leave = new LeaveRequest();
        leave.setStart_date(dto.getStart_date());
        leave.setEnd_date(dto.getEnd_date());
        leave.setReason(dto.getReason());
        leave.setEmployee(emp);
        leave.setStatus("Pending");
        leave.setRequested_at(LocalDateTime.now());


        leaveRequestRepository.save(leave);

        return ResponseEntity.ok("Request Sent successfully!");
    }

    public List<ViewRequest> viewAllLeaveRequests(String username) {
        Users user = usersRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return leaveRequestRepository
                .findByEmployee(user.getEmployee())
                .stream()
                .map((leave)-> {
                    ViewRequest dto = modelMapper.map(leave, ViewRequest.class);
                    dto.setUsername(username);
                    dto.setStatus(leave.getStatus());
                    return dto;
                })
                .toList();

    }
    // ================= GET EMPLOYEE =================

    public EmployeeDTO getEmployees(String username) {

        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("User not found"));

        Employees employee = user.getEmployee();

        EmployeeDTO dto = modelMapper.map(employee, EmployeeDTO.class);

        Employees manager = employee.getManager();

        if (manager != null) {
            dto.setManager(modelMapper.map(manager, ManagerDTO.class));
        } else {
            dto.setManager(null);
        }

        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().toString());
        dto.setStatus(user.getStatus());

        return dto;
    }

    // ================= SHIFT CHANGE REQUEST =================

    public ResponseEntity<?> shiftChangeRequest(String username, SlotDTO slotDTO) {

        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("User not found"));

        Employees employee = user.getEmployee();

        Shifts shift = shiftsRepository.findByShiftName(slotDTO.getPreferredShift())
                .orElseThrow(() -> new ShiftNotFound("Shift not found"));

        SlotChangeRequest request = new SlotChangeRequest();

        request.setEmployee(employee);
        request.setShiftChangeDate(slotDTO.getShiftChangeDate());
        request.setPreferredShift(shift);
        request.setReason(slotDTO.getReason());
        request.setStatus("Pending");
        request.setRequestedAt(new Date());



        slotChangeRepository.save(request);

        return ResponseEntity.ok(Map.of(
                "message", "Slot change request submitted successfully"
        ));
    }


    public ResponseEntity<?> getAllShifts() {
        List<Shifts> shifts = shiftsRepository.findAll();

        return ResponseEntity.ok(shifts);
    }

    public List<ViewAllShiftRequest> viewAllShiftRequests(String username) {
        Users user = usersRepository.findByUsername(username).orElseThrow(() -> new UserNotFound("User not found"));

        List<SlotChangeRequest> request = slotChangeRepository.findByEmployee(user.getEmployee());

        List<ViewAllShiftRequest> arr = request.stream().map((req)->{
            ViewAllShiftRequest dto = modelMapper.map(req, ViewAllShiftRequest.class);
            dto.setUsername(username);
            return dto;
        }).toList();

        return arr;


    }

    public List<Notification> getAllNotification(String username) {
        return notificationRepository.findByUsername(username);
    }


    //submit preference
    public ResponseEntity<?> submitPreference(@Valid ShiftPreferenceDTO shiftPreferenceDTO) {

        boolean exists = shiftPreferenceRepository
                .existsByUsernameAndStatusIgnoreCase(
                        shiftPreferenceDTO.getUsername(), "PENDING");

        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Shift preference already pending!"));
        }

        ShiftPreference shift = new ShiftPreference();
        shift.setUsername(shiftPreferenceDTO.getUsername());
        shift.setPreference1(shiftPreferenceDTO.getPreference1());
        shift.setPreference2(shiftPreferenceDTO.getPreference2());
        shift.setSubmittedAt(LocalDateTime.now());

        shiftPreferenceRepository.save(shift);
        return ResponseEntity.ok("Request Sent successfully!");

    }

    public List<ShiftPreferenceDTO> viewAllShiftPreferences(String username) {
        List<ShiftPreferenceDTO> shifts = shiftPreferenceRepository.findByUsername(username).stream().map((x)->{
            ShiftPreferenceDTO dto = modelMapper.map(x, ShiftPreferenceDTO.class);
            return dto;
        }).toList();

        return shifts;

    }

    public ShiftAllocationDTO getShiftAllocation(String username, LocalDate date) {

        Users user = usersRepository.findByUsername(username).orElseThrow(() -> new UserNotFound("User not found"));

        List<ShiftAllocation> shiftAllocations = shiftAllocationRepository.findByEmployee(user.getEmployee()).stream().toList();


        Optional<ShiftAllocation> shiftAllocation = shiftAllocations
                .stream()
                .filter(x -> {
                    LocalDate assignmentDate = x.getAssignmentdate()
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    return assignmentDate.equals(date) &&
                            x.getAllotmentType().equalsIgnoreCase("request");
                })
                .findFirst();

        if(shiftAllocation.isPresent()) {
            ShiftAllocation shift = shiftAllocation.get();
            ShiftAllocationDTO dto = new ShiftAllocationDTO();
            dto.setShiftName(shift.getShift().getShiftName());
            dto.setStartTime(shift.getShift().getStart_time());
            dto.setEndTime(shift.getShift().getEnd_time());
            return dto;

        }else{
            ShiftAllocation shiftAllocation1 =
                    shiftAllocationRepository
                            .findByEmployeeAndAllotmentType(user.getEmployee(), "scheduled")
                            .stream()
                            .filter(x -> {
                                LocalDate start = x.getAssignmentdate()
                                        .toInstant()
                                        .atZone(ZoneId.systemDefault())
                                        .toLocalDate();

                                LocalDate end = start.plusMonths(1);

                                return (!date.isBefore(start) && !date.isAfter(end));
                            })
                            .findFirst()
                            .orElse(null);

            ShiftAllocationDTO dto = new ShiftAllocationDTO();
            if(shiftAllocation1 == null) {
                return dto;
            }

            dto.setShiftName(shiftAllocation1.getShift().getShiftName());
            dto.setStartTime(shiftAllocation1.getShift().getStart_time());
            dto.setEndTime(shiftAllocation1.getShift().getEnd_time());
            return dto;
        }


    }


}