package com.blogish.blogish.controller;

import com.blogish.blogish.body.BlogRequestBody;
import com.blogish.blogish.body.BlogResponseBody;
import com.blogish.blogish.body.UserBody;
import com.blogish.blogish.dto.Blog;
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
    public ResponseEntity<?> create(@RequestBody BlogRequestBody blogReq) {
        if (blogReq.getTitle().length() < 1) {
            return new ResponseEntity("Title is empty.", HttpStatus.BAD_REQUEST);
        }

        try {
            BlogResponseBody createdBlogResponseBody = blogService.addBlog(blogReq);
            return new ResponseEntity(createdBlogResponseBody, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{blogId}")
    public ResponseEntity<?> update(@PathVariable("blogId") long blogId, @RequestBody BlogRequestBody blogReq) {
        try {
            BlogResponseBody blogResp = blogService.getBlog(blogId);

            // requester validation
            if (!blogResp.getOwner().getUserId().equals(blogReq.getUserId())) {
                return new ResponseEntity("The blog is not owned by the requester.", HttpStatus.BAD_REQUEST);
            }

            // update
            Blog blog = Blog.fetch(blogResp);
            blog.setTitle(blogReq.getTitle());
            blog.setDescription(blogReq.getDescription());
            BlogResponseBody updatedBlog = blogService.updateInfo(blog);

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
            BlogResponseBody blogResp = blogService.getBlog(blogId);
            if (blogResp == null) {
                return new ResponseEntity("Invalid blogId.", HttpStatus.BAD_REQUEST);
            } else if (!blogResp.getOwner().getUserId().equals(userBody.getUserId())) {
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

    @GetMapping("/{blogId}")
    public ResponseEntity<?> getBlog(@PathVariable("blogId") long blogId) {
        try {
            BlogResponseBody blogResp = blogService.getBlog(blogId);
            if (blogResp == null) {
                return new ResponseEntity("Invalid blogId.", HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity(blogResp, HttpStatus.OK);
            }
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/owner/{userId}")
    public ResponseEntity<?> getBlogsOwnedBy(@PathVariable("userId") String userId) {
        try {
            List<BlogResponseBody> blogBodies = blogService.getBlogsOfOwner(userId);
            return new ResponseEntity(blogBodies, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/others/{userId}")
    public ResponseEntity<?> getBlogsNotOwnedBy(@PathVariable("userId") String userId, @RequestParam(defaultValue = "10") int size) {
        try {
            // size validation
            if (size <= 0) {
                return new ResponseEntity("The value of size should be larger than 0.", HttpStatus.BAD_REQUEST);
            }

            // get list
            List<BlogResponseBody> blogBodies = blogService.getBlogsNotOwnedBy(userId, size);
            return new ResponseEntity(blogBodies, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
