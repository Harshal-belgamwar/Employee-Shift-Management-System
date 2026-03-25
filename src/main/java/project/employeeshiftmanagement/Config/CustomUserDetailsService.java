package project.employeeshiftmanagement.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import project.employeeshiftmanagement.Model.Users;
import project.employeeshiftmanagement.Repository.UsersRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    UsersRepository usersRepository;

    @Autowired
    public CustomUserDetailsService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public CustomUserDetails loadUserByUsername(String username){

        Users users=usersRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException(username));
        System.out.println("User found: " + users);
        return  new CustomUserDetails(users);

    }







}
