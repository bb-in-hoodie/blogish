package com.blogish.blogish.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class Post {
    @Builder.Default
    private Long id = -1L;

    @NonNull
    private Long blogId;

    @NonNull
    private String title;

    @Builder.Default
    private String content = null;

    @Builder.Default
    private Long categoryId = null;

    @Builder.Default
    private LocalDateTime createdTime = null;

    @Builder.Default
    private LocalDateTime updatedTime = null;
}
