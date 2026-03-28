package project.employeeshiftmanagement.Exception;

public class EmployeeNotFound extends RuntimeException{
    public EmployeeNotFound(String message){
        super(message);
    }
}
