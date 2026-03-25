package project.employeeshiftmanagement.Filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import project.employeeshiftmanagement.Config.CustomUserDetails;
import project.employeeshiftmanagement.Config.CustomUserDetailsService;
import project.employeeshiftmanagement.Utilities.JwtUtility;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired
    JwtUtility jwtUtility;


    @Autowired
    CustomUserDetailsService customUserDetailsService;


    @Override
    public void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = httpServletRequest.getHeader("Authorization");

        String path = httpServletRequest.getRequestURI();

        if (path.startsWith("/auth/")) {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        if(authHeader!=null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String username = jwtUtility.extractUsername(token);

                if(username!=null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    CustomUserDetails customUserDetails = customUserDetailsService.loadUserByUsername(username);

                    if(jwtUtility.isTokenValid(token, customUserDetails)) {
                        UsernamePasswordAuthenticationToken authtoken =
                            new UsernamePasswordAuthenticationToken(
                                    customUserDetails,
                                    null,
                                    customUserDetails.getAuthorities()
                            );

                        SecurityContextHolder.getContext().setAuthentication(authtoken);
                    }
                }
            } catch (Exception e) {
                System.out.println("JWT Filter Error: " + e.getMessage());
                httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpServletResponse.setContentType("application/json");
                httpServletResponse.getWriter().write("{\"error\": \"Invalid or expired token: " + e.getMessage() + "\"}");
                return;
            }
        } else {
            System.out.println("No Authorization header for path: " + path);
        }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }

}
