package com.blogish.blogish.util;

public class Queries {
    // user
    public static String SELECT_USER_COUNT = "SELECT count(*) FROM user WHERE user_id = :userId";
    public static String SELECT_USER = "SELECT * FROM user WHERE id = :id";
    public static String SELECT_USER_BY_USER_ID = "SELECT * FROM user WHERE user_id = :userId";
    public static String SELECT_USER_PASSWORD_BY_USER_ID = "SELECT password FROM user WHERE user_id = :userId";
    public static String UPDATE_USER_DELETED = "UPDATE user SET deleted = :deleted WHERE user_id = :userId AND deleted = false";

    // blog
    public static String SELECT_BLOG_COUNT = "SELECT count(*) FROM blog WHERE id = :blogId";
    public static String SELECT_BLOG_COUNT_BY_TITLE_AND_USER_ID = "SELECT count(*) FROM blog_user WHERE title = :title AND user_id = :userId";
    public static String SELECT_BLOG = "SELECT * FROM blog WHERE id = :blogId";
    public static String SELECT_BLOGS_BY_USER_ID = "SELECT * FROM blog_user WHERE user_id = :userId";
    public static String SELECT_BLOGS_NOT_OWNED_BY = "SELECT * FROM blog_user WHERE user_id != :userId LIMIT :size";
    public static String DELETE_BLOG = "DELETE FROM blog WHERE id = :blogId";
    public static String UPDATE_BLOG = "UPDATE blog SET title = :title, description = :description WHERE id = :blogId";

    // category
    public static String SELECT_CATEGORIES_BY_BLOG_ID = "SELECT * FROM category WHERE blog_id = :blogId AND name = :name";
    public static String SELECT_CATEGORY_BY_CATEGORY_ID = "SELECT * FROM category WHERE id = :categoryId";
    public static String SELECT_CATEGORY_BY_BLOG_ID_AND_NAME = "SELECT * FROM category WHERE blog_id = :blogId AND name = :name";
    public static String SELECT_CATEGORY_COUNT_BY_NAME_AND_BLOG_ID = "SELECT count(*) FROM category WHERE blog_id = :blogId AND name = :name";
    public static String DELETE_CATEGORY = "DELETE FROM category WHERE categoryId = :categoryId";
    public static String UPDATE_CATEGORY = "UPDATE category SET name = :name WHERE categoryId = :categoryId";
}
