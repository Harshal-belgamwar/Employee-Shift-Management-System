package project.employeeshiftmanagement.controller.Auth;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.server.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.employeeshiftmanagement.Config.CustomUserDetails;
import project.employeeshiftmanagement.Config.CustomUserDetailsService;
import project.employeeshiftmanagement.DTO.Users.UserDTO;
import project.employeeshiftmanagement.Utilities.JwtUtility;
import project.employeeshiftmanagement.service.UserService;

import java.util.Map;

import static io.jsonwebtoken.Jwts.header;

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

            ResponseCookie cookie = ResponseCookie.from("token",jwt)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(3600)
                    .sameSite("Lax")
                    .build();

            return ResponseEntity

                    .ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of(
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
    @GetMapping("/me")
    public ResponseEntity<?> getMe() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String username = auth.getName();

        String role = auth.getAuthorities()
                .stream()
                .findFirst()
                .map(Object::toString)
                .orElse("NO_ROLE");

        return ResponseEntity.ok(
                Map.of(
                        "username", username,
                        "role", role
                )
        );
    }



}
