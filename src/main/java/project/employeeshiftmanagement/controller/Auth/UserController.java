package project.employeeshiftmanagement.controller.Auth;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.employeeshiftmanagement.Config.CustomUserDetails;
import project.employeeshiftmanagement.Config.CustomUserDetailsService;
import project.employeeshiftmanagement.DTO.Users.UserDTO;
import project.employeeshiftmanagement.Utilities.JwtUtility;
import project.employeeshiftmanagement.service.UserService;

import java.util.Map;

@RequestMapping("/auth")
@RestController
public class UserController {

    ModelMapper modelMapper = new ModelMapper();

    @Autowired
    public UserService userService;

    @Autowired
    public CustomUserDetailsService customUserDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtility jwtUtility;

    //    1. Add User
    @PostMapping("/signup")
    public ResponseEntity<?> Adduser(@RequestBody UserDTO userDTO){
        return userService.addUser(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody UserDTO userDTO){

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userDTO.getUsername(),
                            userDTO.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

            String jwt = jwtUtility.generateToken(customUserDetails); // optional JWT
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", jwt,
                    "username", customUserDetails.getUsername(),
                    "role", customUserDetails.getAuthorities().iterator().next().getAuthority()
            ));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception ex) {
            // Catch ANY other exception (JWT generation, database, etc.)
            ex.printStackTrace(); // Log the full error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + ex.getMessage()));
        }

    }





}
