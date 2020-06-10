package com.blogish.blogish.repository;

import com.blogish.blogish.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.Collections;
import java.util.Map;

@Repository
public class UserRepository {
    private String tableName = "user";
    private String generatedKeyColumn = "id";
    private SimpleJdbcInsert simpleJdbcInsert;
    private RowMapper<User> rowMapper = BeanPropertyRowMapper.newInstance(User.class);

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public UserRepository(DataSource dataSource) {
        // create a new simpleJdbcInsert with associated settings
        simpleJdbcInsert = new SimpleJdbcInsert(dataSource)
                                .withTableName(tableName)
                                .usingGeneratedKeyColumns(generatedKeyColumn);
    }

    public String addUser(User user) {
        SqlParameterSource sqlParameterSource = new BeanPropertySqlParameterSource(user);
        simpleJdbcInsert.execute(sqlParameterSource);

        return user.getUserId();
    }

    public User getUser(String userId) {
        try {
            Map<String, ?> params = Collections.singletonMap("userId", userId);
            return namedParameterJdbcTemplate.queryForObject("SELECT * FROM " + tableName + " where user_id = :userId", params, rowMapper);
        } catch (EmptyResultDataAccessException emptyException) { // todo: IncorrectResultSizeDataAccessException handling
            return null;
        }
    }
}
