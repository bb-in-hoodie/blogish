package com.blogish.blogish.util;

public class Queries {
    // user
    public static String SELECT_USER_COUNT = "SELECT count(*) FROM user WHERE user_id = :userId";
    public static String SELECT_USER = "SELECT * FROM user WHERE user_id = :userId";
    public static String SELECT_USER_PASSWORD = "SELECT password FROM user WHERE user_id = :userId";
    public static String UPDATE_USER_DELETED = "UPDATE user SET deleted = :deleted WHERE user_id = :userId AND deleted = false";

    // blog
    public static String SELECT_BLOG_COUNT = "SELECT count(*) FROM blog WHERE id = :blogId";
    public static String SELECT_BLOG_COUNT_BY_TITLE_AND_OWNER_ID = "SELECT count(*) FROM blog WHERE title = :title AND owner_id = :ownerId";
    public static String SELECT_BLOG = "SELECT * FROM blog WHERE id = :blogId";
    public static String SELECT_BLOGS_BY_OWNER_ID = "SELECT * FROM blog WHERE owner_id = :ownerId";
    public static String DELETE_BLOG = "DELETE FROM blog WHERE id = :blogId";
    public static String UPDATE_BLOG = "UPDATE blog SET title = :title, description = :description WHERE id = :blogId";
}
