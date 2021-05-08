package com.blogish.blogish.controller;

import com.blogish.blogish.dto.Post;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    PostService postService;

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPost(@PathVariable("postId") Long postId) {
        try {
            // input validation
            if (postId < 0L) {
                return new ResponseEntity("Invalid postId.", HttpStatus.BAD_REQUEST);
            }

            // return a post
            Post post = postService.getPost(postId);
            return new ResponseEntity(post, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping()
    public ResponseEntity<?> updatePost(@RequestBody Post post) {
        try {
            // input validation
            if (post.getId() == null || post.getId() < 0L) {
                return new ResponseEntity("Invalid postId.", HttpStatus.BAD_REQUEST);
            } else if (post.getTitle() == null || post.getTitle().length() <= 0) {
                return new ResponseEntity("The title of a post is empty.", HttpStatus.BAD_REQUEST);
            } else if (post.getBlogId() == null || post.getBlogId() <= 0L) {
                return new ResponseEntity("Invalid blogId.", HttpStatus.BAD_REQUEST);
            } else if (post.getCategoryId() == null || post.getCategoryId() <= 0L) {
                return new ResponseEntity("Invalid categoryId.", HttpStatus.BAD_REQUEST);
            }

            // update a post and return it
            post.setUpdatedTime(LocalDateTime.now());
            Post updatedPost = postService.updatePost(post);
            return new ResponseEntity(updatedPost, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable("postId") Long postId) {
        try {
            // input validation
            if (postId < 0L) {
                return new ResponseEntity("Invalid postId.", HttpStatus.BAD_REQUEST);
            }

            // delete a post and return its postId
            Long deletedPostId = postService.deletePost(postId);
            return new ResponseEntity(deletedPostId, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
