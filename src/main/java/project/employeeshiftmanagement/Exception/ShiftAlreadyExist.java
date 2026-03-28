package project.employeeshiftmanagement.Exception;

public class ShiftAlreadyExist extends RuntimeException{
    public ShiftAlreadyExist(String message){
        super(message);
    }
}
