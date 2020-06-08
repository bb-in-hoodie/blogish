package com.blogish.blogish.repository;

import com.blogish.blogish.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;

@Repository
public class UserRepository {
    private String tableName = "user";
    private String generatedKeyColumn = "id";
    private SimpleJdbcInsert simpleJdbcInsert;

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
}
