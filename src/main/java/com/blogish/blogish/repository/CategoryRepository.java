package com.blogish.blogish.repository;

import com.blogish.blogish.dto.Category;
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
public class CategoryRepository {
    private final SimpleJdbcInsert simpleJdbcInsert;
    private final RowMapper<Category> categoryMapper = BeanPropertyRowMapper.newInstance(Category.class);

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public CategoryRepository(DataSource dataSource) {
        // create a new simpleJdbcInsert with associated settings
        simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("category")
                .usingGeneratedKeyColumns("id");
    }

    public Long insert(Category category) {
        SqlParameterSource sqlParameterSource = new BeanPropertySqlParameterSource(category);
        Number returnId = simpleJdbcInsert.executeAndReturnKey(sqlParameterSource);
        return returnId.longValue();
    }

    public int countByCategoryId(Long categoryId) {
        MapSqlParameterSource param = new MapSqlParameterSource("categoryId", categoryId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_CATEGORY_COUNT_BY_CATEGORY_ID, param, Integer.class);
    }

    public int countByBlogIdAndName(Long blogId, String name) {
        MapSqlParameterSource param = new MapSqlParameterSource()
                .addValue("blogId", blogId)
                .addValue("name", name);
        return namedParameterJdbcTemplate.queryForObject(SELECT_CATEGORY_COUNT_BY_NAME_AND_BLOG_ID, param, Integer.class);
    }

    public Category selectByCategoryId(Long categoryId) {
        MapSqlParameterSource param = new MapSqlParameterSource("categoryId", categoryId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_CATEGORY_BY_CATEGORY_ID, param, categoryMapper);
    }

    public List<Category> selectAllByBlogId(Long blogId) {
        MapSqlParameterSource param = new MapSqlParameterSource("blogId", blogId);
        return namedParameterJdbcTemplate.query(SELECT_CATEGORIES_BY_BLOG_ID, param, categoryMapper);
    }

    public Category selectByBlogIdAndName(Long blogId, String name) {
        MapSqlParameterSource param = new MapSqlParameterSource()
                .addValue("blogId", blogId)
                .addValue("name", name);
        return namedParameterJdbcTemplate.queryForObject(SELECT_CATEGORY_BY_BLOG_ID_AND_NAME, param, categoryMapper);
    }

    public int delete(Long categoryId) {
        MapSqlParameterSource param = new MapSqlParameterSource("categoryId", categoryId);
        return namedParameterJdbcTemplate.update(DELETE_CATEGORY, param);
    }

    public int update(Long categoryId, String name) {
        MapSqlParameterSource param = new MapSqlParameterSource()
                .addValue("categoryId", categoryId)
                .addValue("name", name);
        return namedParameterJdbcTemplate.update(UPDATE_CATEGORY, param);
    }
}
