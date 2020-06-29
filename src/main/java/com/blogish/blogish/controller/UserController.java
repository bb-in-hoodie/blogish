package com.blogish.blogish.controller;

import com.blogish.blogish.body.UserBody;
import com.blogish.blogish.dto.User;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

import static com.blogish.blogish.util.SessionManager.*;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    BCryptPasswordEncoder bcryptEncoder;

    @PostMapping
    public ResponseEntity<?> join(@RequestBody User user) {
        try {
            // encrypt the password and add it to DB
            user.setPassword(bcryptEncoder.encode(user.getPassword()));
            UserBody userBody = userService.addUser(user);

            return new ResponseEntity(userBody, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        try {
            // check if the user exist in the first place
            UserBody userBody = userService.getUser(body.get("userId"));
            if (userBody != null) {
                // if the user exists, get password of the user and match it with the input
                String password = userService.getPassword(body.get("userId"));
                if (bcryptEncoder.matches(body.get("password"), password)) {
                    setSessionValue(request, SESSION_KEY_USER, userBody);
                    return new ResponseEntity(true, HttpStatus.OK);
                } else {
                    return new ResponseEntity(false, HttpStatus.OK);
                }
            } else {
                return new ResponseEntity("There is no user with such userId.", HttpStatus.BAD_REQUEST);
            }
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // returns true if the user has been logged in
        try {
            removeSessionValue(request, SESSION_KEY_USER);
            return new ResponseEntity(true, HttpStatus.OK);
        } catch (Exception e) {
            // todo: handling exception in more accurate ways
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    @GetMapping("/test")
    public String test(HttpServletRequest request) {
        try {
            Object result = getSessionValue(request, SESSION_KEY_USER);
            return ((UserBody)result).getNickname();
        } catch (NullPointerException e) {
            return "There is no available session.";
        }
    }
}
