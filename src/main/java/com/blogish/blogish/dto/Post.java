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

    @Builder.Default
    private Long blogId = -1L;

    @NonNull
    private String title;

    @Builder.Default
    private String content = "";

    @NonNull
    private Long categoryId;

    @Builder.Default
    private LocalDateTime createdTime = null;

    @Builder.Default
    private LocalDateTime updatedTime = null;
}
