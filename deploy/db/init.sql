CREATE TABLE `user`
(
    `id`       bigint unsigned NOT NULL AUTO_INCREMENT ,
    `nickname` varchar(20) NOT NULL ,
    `user_id`  varchar(20) NOT NULL ,
    `password` binary(60) NOT NULL ,

    PRIMARY KEY (`id`)
);

CREATE TABLE `blog`
(
    `id`          bigint unsigned NOT NULL AUTO_INCREMENT ,
    `title`       varchar(45) NOT NULL ,
    `description` varchar(100) NOT NULL ,
    `created_time` datetime NOT NULL ,
    `owner_id`    bigint unsigned NOT NULL ,

    PRIMARY KEY (`id`),
    KEY `fkIdx_18` (`owner_id`),
    CONSTRAINT `blog_owner` FOREIGN KEY `fkIdx_18` (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `category`
(
    `id`      bigint unsigned NOT NULL AUTO_INCREMENT ,
    `name`    varchar(20) NOT NULL ,
    `blog_id` bigint unsigned NOT NULL ,

    PRIMARY KEY (`id`),
    KEY `fkIdx_47` (`blog_id`),
    CONSTRAINT `available_category` FOREIGN KEY `fkIdx_47` (`blog_id`) REFERENCES `blog` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `post`
(
    `id`           bigint unsigned NOT NULL AUTO_INCREMENT ,
    `title`        varchar(100) NOT NULL ,
    `content`      longtext NOT NULL ,
    `created_time` datetime NOT NULL ,
    `updated_time` datetime NOT NULL ,
    `blog_id`      bigint unsigned NOT NULL ,
    `category_id`  bigint unsigned NOT NULL ,

    PRIMARY KEY (`id`),
    KEY `fkIdx_28` (`blog_id`),
    CONSTRAINT `posts_in_blog` FOREIGN KEY `fkIdx_28` (`blog_id`) REFERENCES `blog` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    KEY `fkIdx_50` (`category_id`),
    CONSTRAINT `posts_in_category` FOREIGN KEY `fkIdx_50` (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `comment`
(
    `id`           bigint unsigned NOT NULL AUTO_INCREMENT ,
    `content`      longtext NOT NULL ,
    `created_time` datetime NOT NULL ,
    `updated_time` datetime NOT NULL ,
    `post_id`      bigint unsigned NOT NULL ,
    `author_id`    bigint unsigned NOT NULL ,

    PRIMARY KEY (`id`),
    KEY `fkIdx_37` (`post_id`),
    CONSTRAINT `comments_in_blog` FOREIGN KEY `fkIdx_37` (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    KEY `fkIdx_40` (`author_id`),
    CONSTRAINT `comment_author` FOREIGN KEY `fkIdx_40` (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW blog_user AS
SELECT blog.*, user.user_id
FROM blog
INNER JOIN user
ON blog.owner_id = user.id