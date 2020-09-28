package com.blogish.blogish.repository;

import com.blogish.blogish.dto.Blog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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
public class BlogRepository {
    private final SimpleJdbcInsert simpleJdbcInsert;
    private final RowMapper<Blog> blogMapper = BeanPropertyRowMapper.newInstance(Blog.class);

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public BlogRepository(DataSource dataSource) {
        // create a new simpleJdbcInsert with associated settings
        simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("blog")
                .usingGeneratedKeyColumns("id");
    }

    public Long insert(Blog blog) {
        SqlParameterSource sqlParameterSource = new BeanPropertySqlParameterSource(blog);
        Number returnedId = simpleJdbcInsert.executeAndReturnKey(sqlParameterSource);
        return returnedId.longValue();
    }

    public int countByBlogId(Long blogId) {
        MapSqlParameterSource param = new MapSqlParameterSource("blogId", blogId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_BLOG_COUNT, param, Integer.class);
    }

    public Blog selectByBlogId(Long blogId) throws DataAccessException, NullPointerException {
        MapSqlParameterSource param = new MapSqlParameterSource("blogId", blogId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_BLOG, param, blogMapper);
    }

    public int countByTitleAndOwnerId(Long ownerId, String title) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("ownerId", ownerId)
                .addValue("title", title);
        return namedParameterJdbcTemplate.queryForObject(SELECT_BLOG_COUNT_BY_TITLE_AND_OWNER_ID, params, Integer.class);
    }

    public List<Blog> selectAllByUserId(Long ownerId) {
        MapSqlParameterSource param = new MapSqlParameterSource("ownerId", ownerId);
        return namedParameterJdbcTemplate.queryForList(SELECT_BLOGS_BY_OWNER_ID, param, Blog.class);
    }

    public int delete(Long blogId) {
        MapSqlParameterSource param = new MapSqlParameterSource("blogId", blogId);
        return namedParameterJdbcTemplate.update(DELETE_BLOG, param);
    }

    public int update(Blog blog) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("blogId", blog.getId())
                .addValue("title", blog.getTitle())
                .addValue("description", blog.getDescription());
        return namedParameterJdbcTemplate.update(UPDATE_BLOG, params);
    }
}
