package com.blogish.blogish.repository;

import com.blogish.blogish.dto.User;
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

import static com.blogish.blogish.util.Queries.*;

@Repository
public class UserRepository {
    private String tableName = "user";
    private String generatedKeyColumn = "id";
    private SimpleJdbcInsert simpleJdbcInsert;
    private RowMapper<User> userMapper = BeanPropertyRowMapper.newInstance(User.class);

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public UserRepository(DataSource dataSource) {
        // create a new simpleJdbcInsert with associated settings
        simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                                .withTableName(tableName)
                                .usingGeneratedKeyColumns(generatedKeyColumn);
    }

    public int countById(String userId) throws DataAccessException, NullPointerException {
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_USER_COUNT, params, Integer.class);
    }

    public int insert(User user) {
        SqlParameterSource sqlParameterSource = new BeanPropertySqlParameterSource(user);
        return simpleJdbcInsert.execute(sqlParameterSource);
    }

    public User selectById(String userId) throws DataAccessException, NullPointerException {
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_USER, params, userMapper);
    }

    public String selectPasswordById(String userId) throws DataAccessException, NullPointerException {
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_USER_PASSWORD, params, String.class);
    }
}
