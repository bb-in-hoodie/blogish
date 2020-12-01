package com.blogish.blogish.service;

import com.blogish.blogish.dto.Category;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.repository.BlogRepository;
import com.blogish.blogish.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    BlogRepository blogRepository;

    @Transactional
    public Category addCategory(Long blogId, String name) throws BadRequestException, InternalServerException {
        try {
            // blog validation
            if (blogRepository.countByBlogId(blogId) <= 0) {
                throw new BadRequestException("Invalid blogId.");
            }

            // check if any category with the same name already exists
            if (categoryRepository.countByBlogIdAndName(blogId, name) > 0) {
                throw new BadRequestException("A category with the same name exists.");
            }

            // create a category and insert it
            Category category = Category.builder()
                    .name(name)
                    .blogId(blogId)
                    .build();

            // return a category on success
            Long id = categoryRepository.insert(category);
            if (id > 0L) {
                category.setId(id);
                return category;
            } else {
                throw new InternalServerException();
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }

    @Transactional
    public Category getCategory(Long categoryId) throws BadRequestException, InternalServerException {
        try {
            return categoryRepository.selectByCategoryId(categoryId);
        } catch (NullPointerException e) {
            throw new BadRequestException(e.getMessage());
        } catch (EmptyResultDataAccessException e) {
            throw new BadRequestException("Invalid categoryId.");
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public List<Category> getCategoriesOfBlog(Long blogId) throws BadRequestException, InternalServerException {
        try {
            // blog validation
            if (blogRepository.countByBlogId(blogId) <= 0) {
                throw new BadRequestException("Invalid blogId.");
            }

            // get a list of categories of the given blog
            return categoryRepository.selectAllByBlogId(blogId);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }

    @Transactional
    public Category updateName(Long categoryId, String name) throws BadRequestException, InternalServerException {
        try {
            // category validation
            if (categoryRepository.countByCategoryId(categoryId) <= 0) {
                throw new BadRequestException("Invalid categoryId.");
            }

            // update the name and return the updated category
            if (categoryRepository.update(categoryId, name) > 0) {
                return categoryRepository.selectByCategoryId(categoryId);
            } else {
                throw new InternalServerException();
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }

    @Transactional
    public Category deleteBlog(Long categoryId) throws BadRequestException, InternalServerException {
        try {
            // category validation
            if (categoryRepository.countByCategoryId(categoryId) <= 0) {
                throw new BadRequestException("Invalid categoryId.");
            }

            // delete and return the deleted category
            Category category = categoryRepository.selectByCategoryId(categoryId);
            if (categoryRepository.delete(categoryId) > 0) {
                return category;
            } else {
                throw new InternalServerException();
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }
}
