package project.employeeshiftmanagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.ShiftPreference;

import java.util.List;

@Repository
public interface ShiftPreferenceRepository extends JpaRepository<ShiftPreference, Integer> {
    List<ShiftPreference> findByUsername(String username);

    boolean existsByUsernameAndStatusIgnoreCase(String username, String pending);

    List<ShiftPreference> findByStatusIgnoreCase(String pending);
}
