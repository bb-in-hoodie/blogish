package com.blogish.blogish.controller;

import com.blogish.blogish.body.UserBody;
import com.blogish.blogish.dto.Blog;
import com.blogish.blogish.dto.User;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.service.BlogService;
import com.blogish.blogish.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blogs")
public class BlogController {
    @Autowired
    BlogService blogService;

    @Autowired
    UserService userService;

    @Autowired
    BCryptPasswordEncoder bcryptEncoder;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Blog blog) {
        if (blog.getTitle().length() < 1) {
            return new ResponseEntity("Title is empty.", HttpStatus.BAD_REQUEST);
        }

        try {
            Blog createdBlog = blogService.addBlog(blog);
            return new ResponseEntity(createdBlog, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{blogId}")
    public ResponseEntity<?> update(@PathVariable("blogId") long blogId, @RequestBody Blog blog) {
        try {
            Blog targetBlog = blogService.getBlog(blogId);

            // requester validation
            if (!targetBlog.getOwnerId().equals(blog.getOwnerId())) {
                return new ResponseEntity("The blog is not owned by the requester.", HttpStatus.BAD_REQUEST);
            }

            // update
            targetBlog.setTitle(blog.getTitle());
            targetBlog.setDescription(blog.getDescription());
            Blog updatedBlog = blogService.updateInfo(targetBlog);

            return new ResponseEntity(updatedBlog, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{blogId}/delete")
    public ResponseEntity<?> delete(@PathVariable("blogId") long blogId, @RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");

            // user validation
            UserBody userBody = userService.getUser(userId);
            if (userBody == null) {
                return new ResponseEntity("Invalid userId.", HttpStatus.BAD_REQUEST);
            }

            String password = userService.getPassword(userId);
            if (!bcryptEncoder.matches(body.get("password"), password)) {
                return new ResponseEntity("Invalid password.", HttpStatus.BAD_REQUEST);
            }

            // blog validation
            Blog targetBlog = blogService.getBlog(blogId);
            if (targetBlog == null) {
                return new ResponseEntity("Invalid blogId.", HttpStatus.BAD_REQUEST);
            } else if (!targetBlog.getOwnerId().equals(userBody.getId())) {
                return new ResponseEntity("The blog is not owned by the requester.", HttpStatus.BAD_REQUEST);
            }

            // delete
            Long deletedBlogId = blogService.deleteBlog(blogId);
            return new ResponseEntity(deletedBlogId, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
