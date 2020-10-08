package com.blogish.blogish.service;

import com.blogish.blogish.dto.Blog;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BlogService {
    @Autowired
    BlogRepository blogRepository;

    @Transactional
    public Blog addBlog(Blog blog) throws BadRequestException, InternalServerException {
        try {
            // check if any blog already exist with the same title owned by the same user
            if (blogRepository.countByTitleAndOwnerId(blog.getOwnerId(), blog.getTitle()) > 0) {
                throw new BadRequestException("A blog owned by the user with the same title exists.");
            }

            // return blog instance with the returned id
            Long blogId = blogRepository.insert(blog);
            blog.setId(blogId);
            return blog;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }

    @Transactional
    public Blog getBlog(Long blogId) throws BadRequestException, InternalServerException {
        try {
            return blogRepository.selectByBlogId(blogId);
        } catch (NullPointerException e) {
            throw new BadRequestException(e.getMessage());
        } catch (EmptyResultDataAccessException e) {
            throw new BadRequestException("Invalid blogId.");
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }

    @Transactional
    public List<Blog> getBlogsOfOwner(Long ownerId) throws BadRequestException, InternalServerException {
        try {
            return blogRepository.selectAllByUserId(ownerId);
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }

    @Transactional
    public List<Blog> getBlogsNotOwnedBy(Long ownerId, int size) throws BadRequestException, InternalServerException {
        try {
            return blogRepository.selectAllNotOwnedBy(ownerId, size);
        } catch (Exception e) {
            throw new InternalServerException();
        }
    }

    @Transactional
    public Blog updateInfo(Blog blog) throws BadRequestException, InternalServerException {
        try {
            // check if a blog with the id exist
            if (blogRepository.countByBlogId(blog.getId()) <= 0) {
                throw new BadRequestException("There is no blog with such id.");
            }

            // return a updated blog
            if (blogRepository.update(blog) > 0) {
                return blog;
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
    public Long deleteBlog(Long blogId)  throws BadRequestException, InternalServerException {
        try {
            // check if a blog with the id exist
            if (blogRepository.countByBlogId(blogId) <= 0) {
                throw new BadRequestException("There is no blog with such id.");
            }

            // return the id of a deleted blog
            if (blogRepository.delete(blogId) > 0) {
                return blogId;
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
