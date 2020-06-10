package com.blogish.blogish.util;

public class Queries {
    public static String SELECT_USER_COUNT = "SELECT count(*) FROM user WHERE user_id = :userId";
    public static String SELECT_USER = "SELECT * FROM user WHERE user_id = :userId";
    public static String SELECT_USER_PASSWORD = "SELECT password FROM user WHERE user_id = :userId";
}
