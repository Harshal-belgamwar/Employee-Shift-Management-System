package project.employeeshiftmanagement.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "User_Id")
    private int user_id;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "Employee_Id")
    private Employees employee;

    @Column(name = "Username" ,unique = true , nullable = false)
    private String username;

    @Column(name = "Password", nullable = false )
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role")
    private Roles role;



    @Column(name = "Status")
    private String status="Active";

    @Column(name = "Is_Changed_Password" )
    private Boolean change_password=false;


}
