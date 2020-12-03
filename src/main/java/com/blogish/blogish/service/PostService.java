package com.blogish.blogish.service;

import com.blogish.blogish.dto.Category;
import com.blogish.blogish.dto.Post;
import com.blogish.blogish.exception.BadRequestException;
import com.blogish.blogish.exception.InternalServerException;
import com.blogish.blogish.repository.BlogRepository;
import com.blogish.blogish.repository.CategoryRepository;
import com.blogish.blogish.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {
    @Autowired
    PostRepository postRepository;

    @Autowired
    BlogRepository blogRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Transactional
    public Post addPost(Post post) throws BadRequestException, InternalServerException {
        try {
            // blog and category validation
            validateBlogAndCategory(post);

            // insert and return the post with returned id
            Long id = postRepository.insert(post);
            post.setId(id);

            return post;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public Post getPost(Long postId) throws BadRequestException, InternalServerException {
        try {
            return postRepository.selectByPostId(postId);
        } catch (NullPointerException e) {
            throw new BadRequestException(e.getMessage());
        } catch (EmptyResultDataAccessException e) {
            throw new BadRequestException("Invalid postId.");
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public List<Post> getPostsOfBlog (Long blogId) throws BadRequestException, InternalServerException {
        try {
            // blog validation
            if (blogRepository.countByBlogId(blogId) <= 0) {
                throw new BadRequestException("Invalid blogId.");
            }

            // get a list of posts belong to the blog
            return postRepository.selectAllByBlogId(blogId);
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public List<Post> getPostsOfCategory (Long categoryId) throws BadRequestException, InternalServerException {
        try {
            // category validation
            if (categoryRepository.countByCategoryId(categoryId) <= 0) {
                throw new BadRequestException("Invalid categoryId.");
            }

            // get a list of posts belong to the blog
            return postRepository.selectAllByCategoryId(categoryId);
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public Post updatePost(Post post) throws BadRequestException, InternalServerException {
        try {
            // blog and category validation
            validateBlogAndCategory(post);

            // post validation
            if (postRepository.countByPostId(post.getId()) <= 0) {
                throw new BadRequestException("Invalid postId.");
            }

            // update a post
            if (postRepository.update(post) > 0) {
                return post;
            } else {
                throw new InternalServerException("Failed to update a post.");
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    @Transactional
    public Long deletePost(Long postId) throws BadRequestException, InternalServerException {
        try {
            // post validation
            if (postRepository.countByPostId(postId) <= 0) {
                throw new BadRequestException("Invalid postId.");
            }

            // delete a post
            if (postRepository.delete(postId) >= 0) {
                return postId;
            } else {
                throw new InternalServerException("Failed to delete a post.");
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    private void validateBlogAndCategory(Post post) throws BadRequestException {
        if (blogRepository.countByBlogId(post.getBlogId()) <= 0) {
            throw new BadRequestException("Invalid blogId.");
        } else if (categoryRepository.countByCategoryId(post.getCategoryId()) <= 0) {
            throw new BadRequestException("Invalid categoryId.");
        } else {
            Category category = categoryRepository.selectByCategoryId(post.getCategoryId());
            if (!category.getBlogId().equals(post.getBlogId())) {
                throw new BadRequestException("The category doesn't belong to the blog.");
            }
        }
    }
}
