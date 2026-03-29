package project.employeeshiftmanagement.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import project.employeeshiftmanagement.Filters.JWTFilter;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private  final CustomUserDetailsService customUserDetailsService;

    private final JWTFilter jwtFilter;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JWTFilter jwtFilter) {

        this.customUserDetailsService = customUserDetailsService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf((csrf)->csrf.disable())
                .cors((cors)->cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                .authorizeHttpRequests(
                        auth->auth
                                .requestMatchers("/auth/login").permitAll()
                                .requestMatchers("/auth/signup").permitAll()
                                .requestMatchers("/auth/me").permitAll()
                                .requestMatchers("/error").permitAll()
                                .requestMatchers("/admin/**").hasAnyRole("ADMIN","MANAGER")
                                .requestMatchers("/manager/**").hasRole("MANAGER")
                                .requestMatchers("/employee/**").hasAnyRole("EMPLOYEE","MANAGER")
                                .anyRequest().authenticated()

                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) ;
        return http.build();
    }



    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider daoAuthenticationProvider=new DaoAuthenticationProvider(customUserDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());

        return daoAuthenticationProvider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("http://localhost:5173");
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
