package project.employeeshiftmanagement.Exception;

public class ShiftNotFound extends RuntimeException{
    public ShiftNotFound(String message){
        super(message);
    }
}
