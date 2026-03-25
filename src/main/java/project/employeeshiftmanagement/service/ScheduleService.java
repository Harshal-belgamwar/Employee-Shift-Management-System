package project.employeeshiftmanagement.service;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.employeeshiftmanagement.DTO.ScheduleResponseDTO;
import project.employeeshiftmanagement.DTO.scheduleAssignDTO;
import project.employeeshiftmanagement.Model.*;
import project.employeeshiftmanagement.Repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Service
public class ScheduleService {

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
    private final ScheduleRepository scheduleRepository;


    @Autowired
    public ScheduleService(EmployeeRepository employeeRepository, UsersRepository usersRepository, ModelMapper modelMapper, ShiftsRepository shiftsRepository, PasswordEncoder passwordEncoder, LeaveRequestRepository leaveRequestRepository, ShiftAllocationRepository shiftAllocationRepository, NotificationRepository notificationRepository, SlotChangeRepository slotChangeRepository, ShiftPreferenceRepository shiftPreferenceRepository, ScheduleRepository scheduleRepository) {
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
        this.scheduleRepository = scheduleRepository;
    }

    public ScheduleResponseDTO generateSchedule(List<Shifts> shifts, List<ShiftPreference> shiftPreferences){
        HashMap<String,Integer> map = new HashMap<>();
        List<scheduleAssignDTO> scheduleAssignDTOList = new ArrayList<>();

        if(shifts.isEmpty() || shiftPreferences.isEmpty()){
            return new ScheduleResponseDTO();
        }

        for(Shifts shift : shifts){

            List<ShiftPreference> arr = shiftPreferences.stream()
                    .filter((x)->x.getPreference1().equalsIgnoreCase(shift.getShiftName()) && x.getPreference2()==null)
                    .toList();

            List<ShiftPreference> arr1 = shiftPreferences
                    .stream()
                    .filter((x)->x.getPreference1().equalsIgnoreCase(shift.getShiftName()) && x.getPreference2()!=null)
                    .sorted(Comparator.comparing(ShiftPreference::getSubmittedAt))
                    .toList();



            List<ShiftPreference> combine = Stream.concat(arr.stream(),arr1.stream()).toList();

            int slots = shift.getSlots_available();

            Iterator<ShiftPreference> iterator = shiftPreferences.iterator();

            while(iterator.hasNext() && slots > 0){
                ShiftPreference shiftPreference = iterator.next();

                if(combine.contains(shiftPreference)){

                    scheduleAssignDTO scheduleAssignDTO = new scheduleAssignDTO();

                    scheduleAssignDTO.setShiftname(shift.getShiftName());
                    scheduleAssignDTO.setUsername(shiftPreference.getUsername());
                    scheduleAssignDTO.setAssignmentDate(LocalDate.now());
                    scheduleAssignDTO.setPreferenceRequestId(shiftPreference.getId());

                    scheduleAssignDTOList.add(scheduleAssignDTO);

                    iterator.remove();

                    slots--;
                }
            }

            map.put(shift.getShiftName(), slots);
        }

        Iterator<ShiftPreference> iterator = shiftPreferences.iterator();

        while(iterator.hasNext()){

            ShiftPreference shiftPreference = iterator.next();
            scheduleAssignDTO scheduleAssignDTO = new scheduleAssignDTO();

            scheduleAssignDTO.setUsername(shiftPreference.getUsername());
            scheduleAssignDTO.setAssignmentDate(LocalDate.now());
            scheduleAssignDTO.setPreferenceRequestId(shiftPreference.getId());

            if(map.get(shiftPreference.getPreference1()) > 0){

                scheduleAssignDTO.setShiftname(shiftPreference.getPreference1());

                scheduleAssignDTOList.add(scheduleAssignDTO);

                map.put(shiftPreference.getPreference1(),
                        map.get(shiftPreference.getPreference1()) - 1);

                iterator.remove();

            }else if(shiftPreference.getPreference2() != null &&
                    map.get(shiftPreference.getPreference2()) > 0){

                scheduleAssignDTO.setShiftname(shiftPreference.getPreference2());

                scheduleAssignDTOList.add(scheduleAssignDTO);

                map.put(shiftPreference.getPreference2(),
                        map.get(shiftPreference.getPreference2()) - 1);

                iterator.remove();

            }else{

                for(Map.Entry<String,Integer> entry: map.entrySet()){
                    if(entry.getValue() > 0){

                        scheduleAssignDTO.setShiftname(entry.getKey());
                        scheduleAssignDTOList.add(scheduleAssignDTO);

                        map.put(entry.getKey(), entry.getValue() - 1);

                        iterator.remove();
                        break;
                    }
                }
            }
        }

        ScheduleResponseDTO scheduleResponseDTO = new ScheduleResponseDTO();
        scheduleResponseDTO.setScheduleAssignDTOList(scheduleAssignDTOList);
        scheduleResponseDTO.setRemainingSlots(map);

        return scheduleResponseDTO;


    }


    public ResponseEntity<?> approveSchedule(@Valid ScheduleResponseDTO scheduleResponseDTO,String username){

        Scheduler scheduler = new Scheduler();
        Users user =  usersRepository.findByUsername(username).orElseThrow(()->new RuntimeException("user not found!"));
        scheduler.setGeneratedBy(user);
        scheduler.setGeneratedAt(LocalDateTime.now());
        scheduler.setStartDate(LocalDate.now());
        scheduler.setEndDate(LocalDate.now().plusMonths(1));
        scheduler.setStatus("Approved");
        scheduleRepository.save(scheduler);


        //assign shift send notification and update preference request
        scheduleResponseDTO.getScheduleAssignDTOList().stream().forEach((x)->{

            ShiftPreference shiftPreference = shiftPreferenceRepository.findById(x.getPreferenceRequestId()).orElseThrow(()->new RuntimeException("shift request not found!"));
            shiftPreference.setStatus("Completed!");
            shiftPreference.setScheduler(scheduler);
            shiftPreferenceRepository.save(shiftPreference);

            ShiftAllocation shiftAllocation = new ShiftAllocation();
            Shifts shift = shiftsRepository.findByShiftName(x.getShiftname()).orElseThrow(()->new RuntimeException("shift not found!"));
            shiftAllocation.setShift(shift);

            Users userx = usersRepository.findByUsername(x.getUsername()).orElseThrow(()->new RuntimeException("user not found!"));
            Employees emp = userx.getEmployee();

            shiftAllocation.setEmployee(emp);
            shiftAllocation.setAssignmentdate(new Date());

            shiftAllocationRepository.save(shiftAllocation);

            Notification notification = new Notification();
            notification.setTitle("New Schedule Generated");
            notification.setMessage("Shift Assigned : " + x.getShiftname());
            notification.setUsername(x.getUsername());

            notificationRepository.save(notification);

        });

        //update slots availablable and filled
        HashMap<String,Integer> map = scheduleResponseDTO.getRemainingSlots();

        List<Shifts> shifts = shiftsRepository.findAll();
        Iterator<Shifts> iterator = shifts.iterator();
        while(iterator.hasNext()){
            Shifts shift =  iterator.next();
            shift.setSlots_available(map.get(shift.getShiftName()));
            shift.setSlots_filled(shift.getSlots()-map.get(shift.getShiftName()));
            shiftsRepository.save(shift);
        }


        return ResponseEntity.ok().body(Map.of("message","Schedule Approved"));


    }


}
