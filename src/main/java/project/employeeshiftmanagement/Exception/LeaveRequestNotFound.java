package project.employeeshiftmanagement.Exception;

public class LeaveRequestNotFound extends RuntimeException{
    public LeaveRequestNotFound(String message){
        super(message);
    }
}
