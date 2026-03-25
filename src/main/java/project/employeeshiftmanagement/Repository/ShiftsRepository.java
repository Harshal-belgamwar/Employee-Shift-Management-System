package project.employeeshiftmanagement.Repository;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.Shifts;

import java.util.Optional;

@Repository
public interface ShiftsRepository extends JpaRepository<Shifts, Integer> {


    boolean existsByShiftName(String shiftName);
    Optional<Shifts> findByShiftName(String shiftName);

    void deleteByShiftName(String shiftName);
}
