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
@Table(name = "Employees")
public class Employees {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Employee_Id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Employees manager;

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "User_Id")
//    private Users user;

    @Column(name = "Employee_Fname", nullable = false)
    private String employeeFname;

    @Column(name = "Employee_Mname")
    private String employeeMname;

    @Column(name = "Employee_Lname", nullable = false)
    private String employeeLname;

    @Column(name = "Employee_Email", unique = true, nullable = false)
    private String employeeEmail;

    @Column(name = "Gender")
    private String gender;

    @Column(name = "Contact_No")
    private String contactNo;

    @Column(name = "Perm_Address")
    private String permanentAddress;

    @Column(name = "Temp_Address")
    private String tempAddress;

    @Column(name = "Designation")
    private String designation;

    @Column(name = "Join_Date" , nullable = false)
    private Date joinDate;

    @Column(name = "End_Date" )
    private Date endDate;

    @Column(name = "Status")
    private  String status = "Active";

}
