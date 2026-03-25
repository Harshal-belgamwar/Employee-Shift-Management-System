package project.employeeshiftmanagement.Model;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "scheduler")
@Data
public class Scheduler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Status (GENERATED, FAILED, etc.)
    @Column(nullable = false)
    private String status;

    // 🔹 When schedule was generated
    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    // 🔹 Who generated the schedule
    @ManyToOne
    @JoinColumn(name = "generated_by", nullable = false)
    private Users generatedBy;

    // 🔹 Start Date of schedule
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    // 🔹 End Date of schedule
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
}