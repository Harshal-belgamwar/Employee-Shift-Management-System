package project.employeeshiftmanagement.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.employeeshiftmanagement.DTO.Users.UserDTO;
import project.employeeshiftmanagement.Exception.InvalidUsernamepassword;
import project.employeeshiftmanagement.Exception.UserNotFound;
import project.employeeshiftmanagement.Model.Employees;
import project.employeeshiftmanagement.Model.Users;
import project.employeeshiftmanagement.Repository.EmployeeRepository;
import project.employeeshiftmanagement.Repository.UsersRepository;

import java.util.Map;
import java.util.Optional;

@Service
public class UserService  {

    UsersRepository usersRepository;
    PasswordEncoder passwordEncoder;
    EmployeeRepository employeeRepository;

    @Autowired
    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder ,  EmployeeRepository employeeRepository) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.employeeRepository = employeeRepository;
    }

    ModelMapper modelMapper = new ModelMapper();

//    1. Add User
    public ResponseEntity<?> addUser(UserDTO userDTO){
        Employees arr=employeeRepository.findByEmployeeEmail(userDTO.getEmail()).orElseThrow(()->new UsernameNotFoundException("Employee not found"));

        Users user = new Users();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole());
        user.setEmployee(arr);

        Users users = usersRepository.save(user);
        return  ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "message", "User created successfully"

                )
        );



    }

//    2. Delete User
    public void deleteUser(int user_id){
        Optional<Users> arr=usersRepository.findById(user_id);

        if(arr.isPresent()){
            usersRepository.deleteById(user_id);
        }else{
            throw new UserNotFound( "User not found");
        }

    }

//    3. Login User
    public UserDTO loginUser(UserDTO userDTO){

        Optional<Users> arr=usersRepository.findByUsername(userDTO.getUsername());

        if(arr.isPresent()){
            if(passwordEncoder.matches(userDTO.getPassword(),arr.get().getPassword())){
                return modelMapper.map(arr.get(),UserDTO.class);
            }else{
                throw new InvalidUsernamepassword("Invalid username or password");
            }
        }else{
            throw new UserNotFound("User not found");
        }

    }



}
