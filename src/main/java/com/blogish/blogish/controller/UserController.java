package com.blogish.blogish.controller;

import com.blogish.blogish.dto.User;
import com.blogish.blogish.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder bcryptEncoder;

    @PostMapping
    public String join(@RequestBody User user) {
        user.setPassword(bcryptEncoder.encode(user.getPassword()));
        return userRepository.addUser(user);
    }
}
