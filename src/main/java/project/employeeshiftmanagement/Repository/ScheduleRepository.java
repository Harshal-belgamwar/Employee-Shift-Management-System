package project.employeeshiftmanagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.Scheduler;

@Repository
public interface ScheduleRepository extends JpaRepository<Scheduler,Integer> {
}
