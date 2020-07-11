package com.blogish.blogish.service;

import com.blogish.blogish.dto.User;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.repository.UserRepository;
import com.blogish.blogish.body.UserBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Transactional
    public UserBody addUser(User user) throws BadRequestException, InternalServerException {
        try {
            // insert a user if there is no user using the same userId
            if (userRepository.countById(user.getUserId()) == 0) {
                userRepository.insert(user);

                return UserBody.builder()
                        .userId(user.getUserId())
                        .nickname(user.getNickname())
                        .build();
            } else {
                throw new BadRequestException("The userId on the request is already used by other user.");
            }
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public UserBody getUser(String userId) throws InternalServerException{
        try {
            User user = userRepository.selectById(userId);
            return UserBody.builder()
                    .userId(user.getUserId())
                    .nickname(user.getNickname())
                    .deleted(user.isDeleted())
                    .build();
        } catch (IncorrectResultSizeDataAccessException e) {
            throw new InternalServerException(e.getMessage());
        } catch (NullPointerException e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public String getPassword(String userId) throws BadRequestException, InternalServerException {
        try {
            return userRepository.selectPasswordById(userId);
        } catch (IncorrectResultSizeDataAccessException e) {
            throw new InternalServerException(e.getMessage());
        } catch (NullPointerException e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public int deleteUser(String userId) throws BadRequestException, InternalServerException{
        try {
            return userRepository.setDeleted(userId, true);
        } catch (DataAccessException e) {
            throw new InternalServerException(e.getMessage());
        }
    }
}
