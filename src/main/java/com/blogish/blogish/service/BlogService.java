package com.blogish.blogish.service;

import com.blogish.blogish.body.BlogRequestBody;
import com.blogish.blogish.body.BlogResponseBody;
import com.blogish.blogish.body.UserBody;
import com.blogish.blogish.dto.Blog;
import com.blogish.blogish.dto.Category;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class BlogService {
    @Autowired
    BlogRepository blogRepository;

    @Autowired
    UserService userService;

    @Autowired
    CategoryService categoryService;

    @Transactional
    public BlogResponseBody addBlog(BlogRequestBody blogReq) throws BadRequestException, InternalServerException {
        try {
            // check if any blog already exist with the same title owned by the same user
            if (blogRepository.countByTitleAndOwnerId(blogReq.getUserId(), blogReq.getTitle()) > 0) {
                throw new BadRequestException("A blog owned by the user with the same title exists.");
            }

            // create a blog and insert it
            UserBody userBody = userService.getUser(blogReq.getUserId());
            Blog blog = Blog.create(blogReq, userBody.getId());
            Long blogId = blogRepository.insert(blog);
            blog.setId(blogId);

            // create a default category
            categoryService.addCategory(blogId, Category.DEFAULT_CATEGORY_NAME);

            return BlogResponseBody.create(blog, userBody);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public BlogResponseBody getBlog(Long blogId) throws BadRequestException, InternalServerException {
        try {
            Blog blog = blogRepository.selectByBlogId(blogId);
            UserBody userBody = userService.getUser(blog.getOwnerId());

            return BlogResponseBody.create(blog, userBody);
        } catch (NullPointerException e) {
            throw new BadRequestException(e.getMessage());
        } catch (EmptyResultDataAccessException e) {
            throw new BadRequestException("Invalid blogId.");
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public List<BlogResponseBody> getBlogsOfOwner(String userId) throws BadRequestException, InternalServerException {
        try {
            List<Blog> blogs = blogRepository.selectAllByUserId(userId);
            List<BlogResponseBody> blogBodies = new ArrayList<>();

            for (Blog blog : blogs) {
                UserBody userBody = userService.getUser(blog.getOwnerId());
                blogBodies.add(BlogResponseBody.create(blog, userBody));
            }
            return blogBodies;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public List<BlogResponseBody> getBlogsNotOwnedBy(String userId, int size) throws BadRequestException, InternalServerException {
        try {
            List<Blog> blogs = blogRepository.selectAllNotOwnedBy(userId, size);
            List<BlogResponseBody> blogBodies = new ArrayList<>();

            for (Blog blog : blogs) {
                UserBody userBody = userService.getUser(blog.getOwnerId());
                blogBodies.add(BlogResponseBody.create(blog, userBody));
            }
            return blogBodies;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public BlogResponseBody updateInfo(Blog blog) throws BadRequestException, InternalServerException {
        try {
            // check if a blog with the id exist
            if (blogRepository.countByBlogId(blog.getId()) <= 0) {
                throw new BadRequestException("There is no blog with such id.");
            }

            // return a updated blog
            if (blogRepository.update(blog) > 0) {
                UserBody userBody = userService.getUser(blog.getOwnerId());
                return BlogResponseBody.create(blog, userBody);
            } else {
                throw new InternalServerException("Failed to update the blog.");
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
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
                throw new InternalServerException("Failed to delete the blog.");
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }
}
