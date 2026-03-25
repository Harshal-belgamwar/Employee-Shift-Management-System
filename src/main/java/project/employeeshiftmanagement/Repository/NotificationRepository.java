package project.employeeshiftmanagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.employeeshiftmanagement.Model.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Integer> {

    List<Notification> findByUsername(String username) ;

}
