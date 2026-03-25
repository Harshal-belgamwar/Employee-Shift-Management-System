package project.employeeshiftmanagement.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Shift_Allocation")
public class ShiftAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Allocation_Id")
    private int assignId;

    @ManyToOne
    @JoinColumn(name = "Shift_Id",nullable = false)
    private Shifts shift;

    @ManyToOne
    @JoinColumn(name = "Employee_Id",nullable = false)
    private Employees employee;

    @Column(name = "Assign_Date",nullable = false)
    private Date assignmentdate;

    @Column(name = "allotment_type",columnDefinition = "VARCHAR(50) DEFAULT 'assigned'")
    private String allotmentType = "scheduled";

}
