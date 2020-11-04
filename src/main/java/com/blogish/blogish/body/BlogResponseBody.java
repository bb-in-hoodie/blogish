package com.blogish.blogish.body;

import com.blogish.blogish.dto.Blog;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class BlogResponseBody {
    @Builder.Default
    private Long id = -1L;

    @NonNull
    private String title;

    @Builder.Default
    private String description = "";

    @Builder.Default
    private LocalDateTime createdTime = LocalDateTime.now();

    @NonNull
    private UserBody owner;

    public static BlogResponseBody create(Blog blog, UserBody owner) {
        return BlogResponseBody.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .description(blog.getDescription())
                .createdTime(blog.getCreatedTime())
                .owner(owner)
                .build();
    }
}
