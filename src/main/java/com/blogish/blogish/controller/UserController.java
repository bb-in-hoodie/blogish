package com.blogish.blogish.controller;

import com.blogish.blogish.body.LoginResultBody;
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
        // input validation
        if (user.getUserId().length() == 0)
            return new ResponseEntity("UserId is empty.", HttpStatus.BAD_REQUEST);
        else if (user.getPassword().length() == 0)
            return new ResponseEntity("Password is empty.", HttpStatus.BAD_REQUEST);
        else if (user.getNickname().length() == 0)
            return new ResponseEntity("Nickname is empty.", HttpStatus.BAD_REQUEST);

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

    @GetMapping("/validate")
    public ResponseEntity<?> validate(@RequestParam(defaultValue = "") String userId) {
        try {
            if (userId.equals("")) {
                return new ResponseEntity("userId is required.", HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity(userService.getUserCount(userId) == 0, HttpStatus.OK);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody User user) {
        // input validation
        if (user.getUserId() == null || user.getUserId().equals("")) {
            return new ResponseEntity("userId is required.", HttpStatus.BAD_REQUEST);
        } else if (user.getNickname() == null || user.getNickname().equals("")) {
            return new ResponseEntity("nickname is required.", HttpStatus.BAD_REQUEST);
        }

        // try updating
        try {
            int result = userService.updateUser(user);
            if (result > 0) {
                UserBody userBody = userService.getUser(user.getUserId());
                return new ResponseEntity(userBody, HttpStatus.OK);
            } else {
                return new ResponseEntity("Failed to update the user information.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(HttpServletRequest request) {
        try {
            // look for a user stored in session
            Object userBody = getSessionValue(request, SESSION_KEY_USER);
            if (userBody == null) {
                // if there is no user found on session, return false wrapped in LoginResultBody
                return new ResponseEntity(new LoginResultBody(false), HttpStatus.OK);
            }
            return new ResponseEntity(new LoginResultBody(true, (UserBody)userBody), HttpStatus.OK);
        } catch (Exception e) {
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
                    return new ResponseEntity(new LoginResultBody(true, userBody), HttpStatus.OK);
                } else {
                    return new ResponseEntity(new LoginResultBody(false), HttpStatus.OK);
                }
            } else {
                return new ResponseEntity(new LoginResultBody(false), HttpStatus.OK);
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

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody Map<String, String> body, HttpServletRequest request) {
        try {
            // validate input
            String userId = body.get("userId");
            String password = body.get("password");
            if (userId == null || userId.length() == 0 || password == null || password.length() == 0) {
                return new ResponseEntity("Both userId and password is required.", HttpStatus.BAD_REQUEST);
            }

            // validate user
            if(userService.getUserCount(userId) != 1) {
                return new ResponseEntity("Failed to find the user.", HttpStatus.BAD_REQUEST);
            }

            // validate password
            if (bcryptEncoder.matches(password, userService.getPassword(userId))) {
                if (userService.deleteUser(userId) > 0) {
                    removeSessionValue(request, SESSION_KEY_USER);
                    return new ResponseEntity(userId, HttpStatus.OK);
                } else {
                    return new ResponseEntity("Failed to delete the user.", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                return new ResponseEntity("Wrong password", HttpStatus.BAD_REQUEST);
            }
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
