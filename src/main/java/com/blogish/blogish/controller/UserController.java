package com.blogish.blogish.controller;

import com.blogish.blogish.dto.User;
import com.blogish.blogish.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

import static com.blogish.blogish.util.SessionManager.*;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder bcryptEncoder;

    private boolean validatePassword(String password, User targetUser) {
        return bcryptEncoder.matches(password, targetUser.getPassword());
    }

    @PostMapping
    public String join(@RequestBody User user) {
        user.setPassword(bcryptEncoder.encode(user.getPassword()));
        return userRepository.addUser(user);
    }

    @PostMapping("/login")
    public boolean login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        // returns true if the user exist and the password is valid
        User user = userRepository.getUser(body.get("userId"));
        if (user != null && validatePassword(body.get("password"), user)) {
            setSessionValue(request, SESSION_KEY_USER, user);
            return true;
        } else {
            return false;
        }
    }

    @PostMapping("/logout")
    public boolean logout(@RequestBody Map<String, String> body, HttpServletRequest request) {
        // returns true if the user has been logged in
        try {
            removeSessionValue(request, SESSION_KEY_USER);
            return true;
        } catch (NullPointerException e) {
            // todo
            return false;
        } catch (IllegalStateException e) {
            // todo
            return false;
        }
    }

    @GetMapping("/test")
    public String test(HttpServletRequest request) {
        Object result = getSessionValue(request, SESSION_KEY_USER);
        if (result == null) {
            return "null";
        } else {
            return ((User)result).getNickname();
        }
    }
}
