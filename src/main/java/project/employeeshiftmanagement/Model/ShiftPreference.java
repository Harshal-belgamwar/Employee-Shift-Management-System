package project.employeeshiftmanagement.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "shift_preferences")
@Data
public class ShiftPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Username (simple approach)
    @Column(nullable = false)
    private String username;

    //  Link to Scheduler (NULL initially)
    @ManyToOne
    @JoinColumn(name = "scheduler_id")
    private Scheduler scheduler;

    //  First Preference
    @Column(name = "preference_1", nullable = false)
    private String preference1;

    //  Second Preference
    @Column(name = "preference_2")
    private String preference2;

    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private String status = "PENDING";

    //  Submitted time
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
}