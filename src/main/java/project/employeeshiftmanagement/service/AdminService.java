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
import project.employeeshiftmanagement.DTO.AdminDTO.EmployeeAdminDTO;
import project.employeeshiftmanagement.DTO.AdminDTO.EmployeeViewDTO;
import project.employeeshiftmanagement.DTO.AdminDTO.NewEmployeeDTO;
import project.employeeshiftmanagement.DTO.AdminDTO.TotalCounts;
import project.employeeshiftmanagement.DTO.LeaveRequest.ViewRequest;
import project.employeeshiftmanagement.DTO.ScheduleResponseDTO;
import project.employeeshiftmanagement.DTO.Shift.createShiftDTO;
import project.employeeshiftmanagement.DTO.Shift.updateShift;
import project.employeeshiftmanagement.DTO.Shift.viewShift;
import project.employeeshiftmanagement.DTO.Users.NewPasswordDTO;
import project.employeeshiftmanagement.DTO.Users.UserDTO;
import project.employeeshiftmanagement.DTO.Users.updateUserDTO;
import project.employeeshiftmanagement.DTO.ViewAllShiftRequest;
import project.employeeshiftmanagement.Exception.*;
import project.employeeshiftmanagement.Model.*;
import project.employeeshiftmanagement.Repository.*;

import java.time.LocalDateTime;
import java.util.*;


@Service
@Transactional
public class AdminService {

    private final EmployeeRepository employeeRepository;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;
    private final ShiftsRepository shiftsRepository;
    private final PasswordEncoder passwordEncoder;
    private final LeaveRequestRepository leaveRequestRepository;
    private final ShiftAllocationRepository shiftAllocationRepository;
    private  final NotificationRepository notificationRepository;
    private final SlotChangeRepository slotChangeRepository;
    private final ShiftPreferenceRepository shiftPreferenceRepository;
    private final ScheduleService scheduleService;


    @Autowired
    public AdminService(EmployeeRepository employeeRepository, UsersRepository usersRepository, ModelMapper modelMapper, ShiftsRepository shiftsRepository, PasswordEncoder passwordEncoder, LeaveRequestRepository leaveRequestRepository, ShiftAllocationRepository shiftAllocationRepository, NotificationRepository notificationRepository, SlotChangeRepository slotChangeRepository, ShiftPreferenceRepository shiftPreferenceRepository, ScheduleService scheduleService) {
        this.employeeRepository = employeeRepository;
        this.usersRepository = usersRepository;
        this.modelMapper = modelMapper;
        this.shiftsRepository = shiftsRepository;

        this.passwordEncoder = passwordEncoder;
        this.leaveRequestRepository = leaveRequestRepository;
        this.shiftAllocationRepository = shiftAllocationRepository;
        this.notificationRepository = notificationRepository;
        this.slotChangeRepository = slotChangeRepository;
        this.shiftPreferenceRepository = shiftPreferenceRepository;
        this.scheduleService = scheduleService;
    }




    //list all employees
    public List<EmployeeAdminDTO> findAll() {

        return usersRepository.findAll().stream().map(
                user -> {
                    Employees employee = user.getEmployee(); // assuming User has getEmployee()
                    EmployeeAdminDTO dto = new EmployeeAdminDTO();

                    if(employee != null) {
                        dto.setEmployeeId(employee.getId());
                    }

                    dto.setUsername(user.getUsername());
                    dto.setRole(user.getRole());
                    dto.setStatus(user.getStatus());

                    return dto;
                }
        ).toList();

    }

    //add Employee
    public ResponseEntity<?> addEmployee(NewEmployeeDTO employeeDTO){
        Employees emp = new Employees();

        // Manually set fields from DTO
        emp.setEmployeeFname(employeeDTO.getEmployeeFname());
        emp.setEmployeeMname(employeeDTO.getEmployeeMname());
        emp.setEmployeeLname(employeeDTO.getEmployeeLname());
        emp.setEmployeeEmail(employeeDTO.getEmployeeEmail());
        emp.setGender(employeeDTO.getGender());
        emp.setContactNo(employeeDTO.getContactNo());
        emp.setPermanentAddress(employeeDTO.getPermanentAddress());
        emp.setTempAddress(employeeDTO.getTempAddress());
        emp.setDesignation(employeeDTO.getDesignation());
        emp.setJoinDate(employeeDTO.getJoinDate());
        emp.setEndDate(employeeDTO.getEndDate());


        // Set manager if provided
        if (employeeDTO.getManagerUsername() != null && !employeeDTO.getManagerUsername().isEmpty()) {
            Users managerUser = usersRepository.findByUsername(employeeDTO.getManagerUsername())
                    .orElseThrow(() -> new UserNotFound("Manager Not Found"));
            Employees managerEmp = employeeRepository.getReferenceById(managerUser.getEmployee().getId());
            emp.setManager(managerEmp);
        } else {
            emp.setManager(null);
        }

        // Save employee
        employeeRepository.save(emp);

        return ResponseEntity.ok(Map.of("message", "Successfully added Employee!"));
    }

    //View Employee By username
    public ResponseEntity<EmployeeViewDTO> employeeDetails(String username) {

        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("User Not Found"));
        Employees employee = user.getEmployee();
        if (employee == null) {
            throw new EmployeeNotFound("Employee Not Found for user: " + username);
        }
        EmployeeViewDTO dto = modelMapper.map(employee, EmployeeViewDTO.class);

        if (employee.getManager() != null) {
            Users manager = usersRepository.findByEmployee(employee.getManager())
                    .orElseThrow(() -> new UserNotFound("Manager Not Found"));
            dto.setManagerUsername(manager.getUsername());
        }
        return ResponseEntity.ok(dto);
    }

    //    update Employee
    public ResponseEntity<EmployeeViewDTO> updateEmployee(EmployeeViewDTO employeeDTO){

        Employees emp = employeeRepository.findById(employeeDTO.getId())
                .orElseThrow(() -> new EmployeeNotFound("Employee not found"));

        // Update fields
        emp.setEmployeeFname(employeeDTO.getEmployeeFname());
        emp.setEmployeeMname(employeeDTO.getEmployeeMname());
        emp.setEmployeeLname(employeeDTO.getEmployeeLname());
        emp.setEmployeeEmail(employeeDTO.getEmployeeEmail());
        emp.setGender(employeeDTO.getGender());
        emp.setContactNo(employeeDTO.getContactNo());
        emp.setPermanentAddress(employeeDTO.getPermanentAddress());
        emp.setTempAddress(employeeDTO.getTempAddress());
        emp.setDesignation(employeeDTO.getDesignation());
        emp.setJoinDate(employeeDTO.getJoinDate());
        emp.setEndDate(employeeDTO.getEndDate());
        emp.setStatus(employeeDTO.getStatus());

        // Update manager
        if(employeeDTO.getManagerUsername() != null){

            Users managerUser = usersRepository.findByUsername(employeeDTO.getManagerUsername())
                    .orElseThrow(() -> new UserNotFound("User not found"));

            Employees managerEmployee = managerUser.getEmployee();

            if(managerEmployee == null){
                throw new EmployeeNotFound("no employee found for user: " + employeeDTO.getManagerUsername());
            }

            emp.setManager(managerEmployee);
        }

        Employees savedEmployee = employeeRepository.save(emp);

        EmployeeViewDTO dto = modelMapper.map(savedEmployee, EmployeeViewDTO.class);

        return ResponseEntity.ok(dto);
    }

    //delete Employee by username
    public ResponseEntity<?> deleteEmployee(String username){

        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("User not found"));

        Employees employee = user.getEmployee();
        if (employee == null) {
            throw new EmployeeNotFound("Employee not found for user: " + username);
        }

        // Find employees who report to this manager
        List<Employees> subordinates = employeeRepository.findByManager(employee);

        for(Employees emp : subordinates){
            emp.setManager(null);   // remove manager reference
        }

        employeeRepository.saveAll(subordinates);

        // Delete user account

        usersRepository.delete(user);

        // Delete employee
        employeeRepository.delete(employee);
        return ResponseEntity.ok(Map.of("message: ","sucessfully deleted Employee!"));
    }

    // create User
    public ResponseEntity<?> createUser(UserDTO userDTO){
        if(usersRepository.existsByUsername(userDTO.getUsername())){
            throw new UserAlreadyExist("user with username:"+userDTO.getUsername()+"already exists");
        }
        Employees emp = employeeRepository.findByEmployeeEmail(userDTO.getEmail()).orElseThrow(()->new EmployeeNotFound("Employee Not Found"));
        if(usersRepository.existsByEmployee(emp)){
            throw new UserAlreadyExist("User already exists for this employee");
        }

        Users user = modelMapper.map(userDTO,Users.class);
        user.setEmployee(emp);
        usersRepository.save(user);

        return ResponseEntity.ok(Map.of("message: ","sucessfully created User!","username",userDTO.getUsername()));
    }

    //add multiple users
    public ResponseEntity<?> createUsers(List<UserDTO> userDTOList) {

        List<Users> usersToSave = new ArrayList<>();

        for (UserDTO userDTO : userDTOList) {

            // 1. Check username already exists
            if (usersRepository.existsByUsername(userDTO.getUsername())) {
                throw new UserAlreadyExist("Username already exists: " + userDTO.getUsername());
            }

            // 2. Find employee by email
            Employees emp = employeeRepository.findByEmployeeEmail(userDTO.getEmail())
                    .orElseThrow(() -> new EmployeeNotFound(
                            "Employee Not Found: " + userDTO.getEmail()
                    ));

            // 3. Check if employee already has user
            if (usersRepository.existsByEmployee(emp)) {
                throw new UserAlreadyExist(
                        "User already exists for employee: "
                );
            }

            // 4. Map and set employee
            Users user = modelMapper.map(userDTO, Users.class);
            user.setEmployee(emp);

            usersToSave.add(user);
        }

        // 5. Save all at once 🚀
        usersRepository.saveAll(usersToSave);

        return ResponseEntity.ok(
                Map.of("message", "All users created successfully", "count", usersToSave.size())
        );
    }

    //    view all users
    public ResponseEntity<List<updateUserDTO>> viewUsers() {
    List<updateUserDTO> users = usersRepository.findAll().stream().map(user -> {
        updateUserDTO dto = new updateUserDTO();
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setPassword(null); // never expose password
        return dto;
    }).toList();

    return ResponseEntity.ok(users);
}

    // ------------------- Update user -------------------
    public ResponseEntity<?> updateUser(String username, updateUserDTO dto) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound("User not found"));

        // Update fields if provided
        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            user.setUsername(dto.getUsername());
        }

        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }

        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            user.setStatus(dto.getStatus());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setChange_password(true); // mark password as changed
        }

        usersRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "User updated successfully",
                "username", user.getUsername()
        ));
    }

    public ResponseEntity<?> deleteUser(String username){
        Users user = usersRepository.findByUsername(username).orElseThrow(()->new UserNotFound("User not found"));

        usersRepository.deleteByUsername(username);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    //    create shift
    public ResponseEntity<?> createShift(createShiftDTO createShiftDTO){
        Optional<Shifts> existing = shiftsRepository.findByShiftName(createShiftDTO.getShiftName());

        if (existing.isPresent()) {
            throw new ShiftAlreadyExist("Shift Already Exist");
        }
//
//        if(createShiftDTO.getStart_time().equals(createShiftDTO.getEnd_time())){
//            return ResponseEntity.badRequest()
//                    .body(Map.of("error", "Start and End time cannot be same"));
//        }
        Shifts shift = modelMapper.map(createShiftDTO, Shifts.class);
        shift.setSlots_available(shift.getSlots());
        shift.setSlots_filled(0);

        shiftsRepository.save(shift);

        return ResponseEntity.ok(Map.of("message","sucessfully created Shift!"));

    }

    //update Shift
    public ResponseEntity<?> updateShift(String shiftname , updateShift updateShift){
        // Find existing shift
        Shifts existingShift = shiftsRepository.findByShiftName(shiftname)
                .orElse(null);

        if (existingShift == null) {
            throw new ShiftNotFound("Shift Not Found");
        }

        if (updateShift.getShiftName() != null && !updateShift.getShiftName().isBlank()) {
            existingShift.setShiftName(updateShift.getShiftName());
        }
        if (updateShift.getStart_time() != null) {
            existingShift.setStart_time(updateShift.getStart_time());
        }
        if (updateShift.getEnd_time() != null) {
            existingShift.setEnd_time(updateShift.getEnd_time());
        }

        // Update slots
        int oldFilled = existingShift.getSlots_filled();
        int newSlots = updateShift.getSlots();




        existingShift.setSlots_available(newSlots - oldFilled);

        if(updateShift.getSlots() != null &&  updateShift.getSlots() > 0){
            existingShift.setSlots(updateShift.getSlots());
        }

        Shifts updatedShift = shiftsRepository.save(existingShift);

        return ResponseEntity.ok(modelMapper.map(updatedShift, updateShift.class));
    }

//    Delete Shift
    public ResponseEntity<?> deleteShift(String shiftname){
        Optional<Shifts> optionalShift = shiftsRepository.findByShiftName(shiftname);

        if (optionalShift.isEmpty()) {
          throw  new ShiftNotFound("Shift Not Found");
        }


        shiftsRepository.deleteByShiftName(shiftname);
        return ResponseEntity.ok(Map.of("message: ","sucessfully deleted Shift!"));
    }

//    view all shift
    public List<viewShift> getShift(){
        List<viewShift> resp = shiftsRepository.findAll().stream().map((x)->modelMapper.map(x, viewShift.class)).toList();
        return resp;


    }

//    update Password
    public ResponseEntity<?> updatePassword(String username, NewPasswordDTO newPasswordDTO){
        Users user = usersRepository.findByUsername(username).orElseThrow(() -> new UserNotFound("User not found"));

        user.setPassword(passwordEncoder.encode(newPasswordDTO.getNewPassword()));
        usersRepository.save(user);

        return ResponseEntity.ok(Map.of("message","sucessfully updated Password!"));

    }

//    add employee to Shift
    public ResponseEntity<?> employeeShiftUpdate(String username,String shiftName){


            Users user = usersRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFound("User not found"));

            Shifts shift = shiftsRepository.findByShiftName(shiftName)
                    .orElseThrow(() -> new ShiftNotFound("Shift not found"));

            Employees employee = user.getEmployee();

            if (employee == null) {
               throw new EmployeeNotFound("Employee not linked to user");
            }

        List<ShiftAllocation> allocations = shiftAllocationRepository.findByEmployee(employee);

        ShiftAllocation allocation;

        if (allocations.isEmpty()) {
            allocation = new ShiftAllocation();
            allocation.setEmployee(employee);
            allocation.setAssignmentdate(new Date());
        } else {
            allocation = allocations.get(0); // ⚠️ not ideal
        }
            allocation.setShift(shift);

            shiftAllocationRepository.save(allocation);

            return ResponseEntity.ok("Shift updated successfully");
    }


    public TotalCounts getAllCounts(){

        List<Users> users = usersRepository.findAll();
        List<Shifts> shifts = shiftsRepository.findAll();

        TotalCounts totalCounts = new TotalCounts();
        totalCounts.setTotalUsersCount(users.size());
        totalCounts.setShiftsCount(shifts.size());

        long employeeCount = users.stream()
                .filter(user -> user.getRole().toString().equalsIgnoreCase("EMPLOYEE"))
                .count();

        long managerCount = users.stream()
                .filter(user -> user.getRole().toString().equalsIgnoreCase("MANAGER"))
                .count();

        long adminCount = users.stream()
                .filter(user -> user.getRole().toString().equalsIgnoreCase("ADMIN"))
                .count();

        long uniqueDesignationCount = users.stream()
                .map(user -> user.getEmployee())   // get employee
                .filter(emp -> emp != null)        // skip null
                .map(emp -> emp.getDesignation()) // get designation
                .filter(des -> des != null)        // skip null
                .distinct()                        // remove duplicates
                .count();

        long activeUser = users.stream().filter(user->user.getStatus().equalsIgnoreCase("ACTIVE")).count();

        totalCounts.setEmployeesCount((int) employeeCount);
        totalCounts.setManagerCount((int) managerCount);
        totalCounts.setAdminCount((int) adminCount);
        totalCounts.setDesignationCount((int) uniqueDesignationCount);
        totalCounts.setActiveUsersCount((int) activeUser);

        return totalCounts;


    }


    public List<ViewRequest> viewAllRequest() {

        List<LeaveRequest> requests = leaveRequestRepository.findAll();

        return requests.stream().map((x)-> {
            Users user = usersRepository.findByEmployee(x.getEmployee()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
            ViewRequest req = new ViewRequest();
            req.setReason(x.getReason());
            req.setStatus(x.getStatus());
            req.setRequested_at(x.getRequested_at());
            req.setStart_date(x.getStart_date());
            req.setEnd_date(x.getEnd_date());
            req.setUsername(user.getUsername());
            req.setRequested_at(LocalDateTime.now());
            req.setLeave_id(x.getLeave_id());
            return req;
        }).toList();


    }
    //approval request
    public ResponseEntity<?> approveRequest(@Valid ViewRequest viewRequest) {

        Users user  = usersRepository.findByUsername(viewRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Employees employee = user.getEmployee();


        LeaveRequest leaveRequest = leaveRequestRepository.findById(viewRequest.getLeave_id())
                .orElseThrow(() -> new LeaveRequestNotFound("Request not found"));
        leaveRequest.setStatus("Approved");
        leaveRequest.setReason(viewRequest.getReason());
        leaveRequest.setStart_date(viewRequest.getStart_date());
        leaveRequest.setEnd_date(viewRequest.getEnd_date());
        leaveRequest.setLeave_id(viewRequest.getLeave_id());
        leaveRequest.setRequested_at(viewRequest.getRequested_at());
        leaveRequest.setEmployee(employee);

        leaveRequestRepository.save(leaveRequest);

        Notification notification = new Notification();
        notification.setTitle("Leave Request");
        notification.setMessage("Leave request has been approved");
        notification.setUsername(viewRequest.getUsername());

        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of("message","sucessfully approved request!"));

    }

    public ResponseEntity<?> rejectRequest(@Valid ViewRequest viewRequest) {

        Users user  = usersRepository.findByUsername(viewRequest.getUsername()).orElseThrow(() -> new UserNotFound("User not found"));
        Employees employee = user.getEmployee();


        LeaveRequest leaveRequest = leaveRequestRepository.findById(viewRequest.getLeave_id())
                .orElseThrow(() -> new LeaveRequestNotFound("Request not found"));
        leaveRequest.setStatus("Rejected");
        leaveRequest.setReason(viewRequest.getReason());
        leaveRequest.setStart_date(viewRequest.getStart_date());
        leaveRequest.setEnd_date(viewRequest.getEnd_date());
        leaveRequest.setLeave_id(viewRequest.getLeave_id());
        leaveRequest.setRequested_at(viewRequest.getRequested_at());
        leaveRequest.setEmployee(employee);

        leaveRequestRepository.save(leaveRequest);

        Notification notification = new Notification();
        notification.setTitle("Leave Request");
        notification.setMessage("Leave request has been Rejected");
        notification.setUsername(viewRequest.getUsername());

        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of("message","sucessfully Rejected request!"));
    }

    public List<ViewAllShiftRequest> getAllShiftChangeRequest() {

        List<SlotChangeRequest> requests = slotChangeRepository.findAll();

        return   requests
                .stream()
                .map((x)->{
                    Users user = usersRepository.findByEmployee(x.getEmployee()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    Shifts shift = shiftsRepository.findByShiftName(x.getPreferredShift().getShiftName()).orElseThrow(()->new RuntimeException("Slot not found!"));
                    ViewAllShiftRequest viewAllShiftRequest = new ViewAllShiftRequest();
                    viewAllShiftRequest.setUsername(user.getUsername());
                    viewAllShiftRequest.setStatus(x.getStatus());
                    viewAllShiftRequest.setReason(x.getReason());
                    viewAllShiftRequest.setPreferredShift(shift.getShiftName());
                    viewAllShiftRequest.setShiftChangeDate(x.getShiftChangeDate());
                    viewAllShiftRequest.setRequestedAt(x.getRequestedAt());
                    viewAllShiftRequest.setId(x.getSlotChangeId());
                    return viewAllShiftRequest;

                })
                .toList();

    }

    public List<ViewAllShiftRequest> getShiftChangeRequest(String username) {
        Users userx  = usersRepository.findByUsername(username).orElseThrow(() -> new UserNotFound("User not found"));
        List<SlotChangeRequest> requests = slotChangeRepository.findByEmployee_Manager(userx.getEmployee());

        return   requests
                .stream()
                .map((x)->{
                    Users user = usersRepository.findByEmployee(x.getEmployee()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
                    Shifts shift = shiftsRepository.findByShiftName(x.getPreferredShift().getShiftName()).orElseThrow(()->new RuntimeException("Slot not found!"));
                    ViewAllShiftRequest viewAllShiftRequest = new ViewAllShiftRequest();
                    viewAllShiftRequest.setUsername(user.getUsername());
                    viewAllShiftRequest.setStatus(x.getStatus());
                    viewAllShiftRequest.setReason(x.getReason());
                    viewAllShiftRequest.setPreferredShift(shift.getShiftName());
                    viewAllShiftRequest.setShiftChangeDate(x.getShiftChangeDate());
                    viewAllShiftRequest.setRequestedAt(x.getRequestedAt());
                    return viewAllShiftRequest;

                })
                .toList();

    }

    public ResponseEntity<?> approveShiftRequest(@Valid ViewAllShiftRequest viewAllShiftRequest) {

        SlotChangeRequest slotChangeRequest = slotChangeRepository.findBySlotChangeId(viewAllShiftRequest.getId());
        slotChangeRequest.setStatus("Approved");

        slotChangeRepository.save(slotChangeRequest);

        ShiftAllocation shiftAllocation = new ShiftAllocation();
        shiftAllocation.setShift(slotChangeRequest.getPreferredShift());
        shiftAllocation.setEmployee(slotChangeRequest.getEmployee());
        shiftAllocation.setAssignmentdate(new Date());
        shiftAllocation.setAllotmentType("request");

        shiftAllocationRepository.save(shiftAllocation);

        Notification notification = new Notification();
        notification.setTitle("Shift Change Request");
        notification.setMessage("Shift Change request has Acceted");
        notification.setUsername(viewAllShiftRequest.getUsername());

        notificationRepository.save(notification);
        return ResponseEntity.ok(Map.of("message","Request approved !"));

    }

    public ResponseEntity<?> rejectShiftRequest(@Valid ViewAllShiftRequest viewAllShiftRequest) {
        SlotChangeRequest slotChangeRequest = slotChangeRepository.findBySlotChangeId(viewAllShiftRequest.getId());
        slotChangeRequest.setStatus("Rejected");

        slotChangeRepository.save(slotChangeRequest);



        Notification notification = new Notification();
        notification.setTitle("Shift Change Request");
        notification.setMessage("Shift Change request has Rejected");
        notification.setUsername(viewAllShiftRequest.getUsername());

        notificationRepository.save(notification);
        return ResponseEntity.ok(Map.of("message","Request approved !"));
    }

    public ScheduleResponseDTO generateSchedule() {
        List<Shifts> shifts = shiftsRepository.findAll();
        List<ShiftPreference> shiftPreferences = shiftPreferenceRepository.findByStatusIgnoreCase("Pending");

        return scheduleService.generateSchedule(shifts, shiftPreferences);

    }

    //view all users under manager
    public ResponseEntity<List<updateUserDTO>> viewNewUsers(String username) {
        Users user = usersRepository.findByUsername(username).orElseThrow(() -> new UserNotFound("User not found"));


        List<updateUserDTO> users = usersRepository.findAll().stream()
                .filter(u ->
                u.getEmployee() != null &&
                        u.getEmployee().getManager() != null &&
                        u.getEmployee().getManager()
                                .equals(user.getEmployee())
        ).map(userx -> {
            updateUserDTO dto = new updateUserDTO();
            dto.setUsername(userx.getUsername());
            dto.setRole(userx.getRole());
            dto.setStatus(userx.getStatus());
            dto.setPassword(null); // never expose password
            return dto;
        }).toList();

        return ResponseEntity.ok(users);

    }

    public List<ViewRequest> viewLeaveRequest(String username) {
        Users userx = usersRepository.findByUsername(username).orElseThrow(() -> new UserNotFound("User not found"));

        List<LeaveRequest> requests = leaveRequestRepository.findByEmployee_Manager(userx.getEmployee());

        return requests.stream().map((x)-> {
            Users user = usersRepository.findByEmployee(x.getEmployee()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
            ViewRequest req = new ViewRequest();
            req.setReason(x.getReason());
            req.setStatus(x.getStatus());
            req.setRequested_at(x.getRequested_at());
            req.setStart_date(x.getStart_date());
            req.setEnd_date(x.getEnd_date());
            req.setUsername(user.getUsername());
            req.setRequested_at(LocalDateTime.now());
            req.setLeave_id(x.getLeave_id());
            return req;
        }).toList();


    }

    public ResponseEntity<?> addEmployees(List<NewEmployeeDTO> employeeDTOList) {

        List<Employees> employees = employeeDTOList.stream().map(employeeDTO -> {

            Employees emp = new Employees();

            // Map fields
            emp.setEmployeeFname(employeeDTO.getEmployeeFname());
            emp.setEmployeeMname(employeeDTO.getEmployeeMname());
            emp.setEmployeeLname(employeeDTO.getEmployeeLname());
            emp.setEmployeeEmail(employeeDTO.getEmployeeEmail());
            emp.setGender(employeeDTO.getGender());
            emp.setContactNo(employeeDTO.getContactNo());
            emp.setPermanentAddress(employeeDTO.getPermanentAddress());
            emp.setTempAddress(employeeDTO.getTempAddress());
            emp.setDesignation(employeeDTO.getDesignation());
            emp.setJoinDate(employeeDTO.getJoinDate());
            emp.setEndDate(employeeDTO.getEndDate());

            // Manager handling
            if (employeeDTO.getManagerUsername() != null && !employeeDTO.getManagerUsername().isEmpty()) {
                Users managerUser = usersRepository.findByUsername(employeeDTO.getManagerUsername())
                        .orElseThrow(() -> new UserNotFound(
                                "Manager with username: " + employeeDTO.getManagerUsername() + " not found"
                        ));

                emp.setManager(managerUser.getEmployee()); // no need for getReferenceById
            } else {
                emp.setManager(null);
            }

            return emp;

        }).toList();

        // Save all at once (important 🚀)
        employeeRepository.saveAll(employees);

        return ResponseEntity.ok(Map.of("message", "Successfully added all Employees!"));
    }
}
