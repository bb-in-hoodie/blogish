package com.blogish.blogish.controller;

import com.blogish.blogish.dto.Category;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @GetMapping("/{categoryId}")
    public ResponseEntity<?> getCategory(@PathVariable("categoryId") Long categoryId) {
        try {
            Category category = categoryService.getCategory(categoryId);
            if (category == null) {
                return new ResponseEntity("Invalid categoryId.", HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity(category, HttpStatus.OK);
            }
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{categoryId}")
    public ResponseEntity<?> update(@PathVariable("categoryId") Long categoryId, @RequestBody Map<String, String> body) {
        try {
            // input validation
            if (!body.containsKey("name")) {
                return new ResponseEntity("The name of a blog is empty.", HttpStatus.BAD_REQUEST);
            }

            // update name
            Category category = categoryService.updateName(categoryId, body.get("name"));
            return new ResponseEntity(category, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<?> delete(@PathVariable("categoryId") Long categoryId) {
        try {
            // delete
            Category category = categoryService.deleteBlog(categoryId);
            return new ResponseEntity(category, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (InternalServerException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
