package com.blogish.blogish.repository;

import com.blogish.blogish.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    private String tableName = "user";
    private String generatedKeyColumn = "id";

    @Autowired
    private SimpleJdbcInsert simpleJdbcInsert;

    public String addUser(User user) {
        SqlParameterSource sqlParameterSource = new BeanPropertySqlParameterSource(user);
        simpleJdbcInsert
            .withTableName(tableName)
            .usingGeneratedKeyColumns(generatedKeyColumn)
            .execute(sqlParameterSource);

        return user.getUserId();
    }
}
