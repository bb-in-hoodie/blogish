package com.blogish.blogish.repository;

import com.blogish.blogish.dto.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;

import java.util.List;

import static com.blogish.blogish.util.Queries.*;

@Repository
public class PostRepository {
    private final SimpleJdbcInsert simpleJdbcInsert;
    private final RowMapper<Post> postMapper = BeanPropertyRowMapper.newInstance(Post.class);

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public PostRepository(DataSource dataSource) {
        // create a new simpleJdbcInsert with associated settings
        simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("post")
                .usingGeneratedKeyColumns("id");
    }

    public Long insert(Post post) {
        SqlParameterSource sqlParameterSource = new BeanPropertySqlParameterSource(post);
        Number returnedId = simpleJdbcInsert.executeAndReturnKey(sqlParameterSource);
        return returnedId.longValue();
    }

    public int countByPostId(Long postId) {
        MapSqlParameterSource param = new MapSqlParameterSource("postId", postId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_POST_COUNT_BY_POST_ID, param, Integer.class);
    }

    public Post selectByPostId(Long postId) {
        MapSqlParameterSource param = new MapSqlParameterSource("postId", postId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_POST_BY_POST_ID, param, Post.class);
    }

    public List<Post> selectAllByBlogId(Long blogId) {
        MapSqlParameterSource param = new MapSqlParameterSource("blogId", blogId);
        return namedParameterJdbcTemplate.query(SELECT_POSTS_BY_BLOG_ID, param, postMapper);
    }

    public List<Post> selectAllByCategoryId(Long categoryId) {
        MapSqlParameterSource param = new MapSqlParameterSource("categoryId", categoryId);
        return namedParameterJdbcTemplate.query(SELECT_POSTS_BY_CATEGORY_ID, param, postMapper);
    }

    public int delete(Long postId) {
        MapSqlParameterSource param = new MapSqlParameterSource("postId", postId);
        return namedParameterJdbcTemplate.update(DELETE_POST, param);
    }

    public int update(Post post) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("postId", post.getId())
                .addValue("title", post.getTitle())
                .addValue("content", post.getContent())
                .addValue("categoryId", post.getCategoryId())
                .addValue("updatedTime", post.getUpdatedTime());
        return namedParameterJdbcTemplate.update(UPDATE_POST, params);
    }
}
