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
    private final SimpleJdbcInsert simpleJdbcInsert;
    private final RowMapper<User> userMapper = BeanPropertyRowMapper.newInstance(User.class);

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public UserRepository(DataSource dataSource) {
        // create a new simpleJdbcInsert with associated settings
        simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                                .withTableName("user")
                                .usingGeneratedKeyColumns("id");
    }

    public int countById(String userId) throws DataAccessException, NullPointerException {
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_USER_COUNT, params, Integer.class);
    }

    public int insert(User user) {
        SqlParameterSource sqlParameterSource = new BeanPropertySqlParameterSource(user);
        return simpleJdbcInsert.execute(sqlParameterSource);
    }

    public User selectById(Long id) throws DataAccessException, NullPointerException {
        MapSqlParameterSource params = new MapSqlParameterSource("id", id);
        return namedParameterJdbcTemplate.queryForObject(SELECT_USER, params, userMapper);
    }

    public User selectByUserId(String userId) throws DataAccessException, NullPointerException {
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_USER_BY_USER_ID, params, userMapper);
    }

    public String selectPasswordByUserId(String userId) throws DataAccessException, NullPointerException {
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return namedParameterJdbcTemplate.queryForObject(SELECT_USER_PASSWORD_BY_USER_ID, params, String.class);
    }

    public int setNickname(String userId, String nickname) throws DataAccessException {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("nickname", nickname);
        return namedParameterJdbcTemplate.update(UPDATE_USER_NICKNAME, params);
    }

    public int delete(String userId) throws DataAccessException {
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return namedParameterJdbcTemplate.update(DELETE_USER, params);
    }
}
