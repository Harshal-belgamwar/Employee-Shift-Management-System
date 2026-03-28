package project.employeeshiftmanagement.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import project.employeeshiftmanagement.DTO.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = EmployeeNotFound.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> employeeNotFound(EmployeeNotFound ex){
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(),HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = UserNotFound.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> employeeNotFound(UserNotFound ex){
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(),HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = ShiftNotFound.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> error(ShiftNotFound ex){
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(),HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = UserAlreadyExist.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ErrorResponse> userAlreadyExist(UserAlreadyExist ex){
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(),HttpStatus.CONFLICT), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = ShiftAlreadyExist.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ErrorResponse> userAlreadyExist(ShiftAlreadyExist ex){
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(),HttpStatus.CONFLICT), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = LeaveRequestNotFound.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> leaveRequestNotFound(LeaveRequestNotFound ex){
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(),HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = InvalidUsernamepassword.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ErrorResponse> invalidUsernamepassword(InvalidUsernamepassword ex){
        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(),HttpStatus.UNAUTHORIZED), HttpStatus.UNAUTHORIZED);
    }



}
