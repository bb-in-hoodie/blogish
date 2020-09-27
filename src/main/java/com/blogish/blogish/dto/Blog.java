package com.blogish.blogish.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Blog {
    private Long id;

    @NonNull
    private String title;

    @Builder.Default
    private String description = "";

    @Builder.Default
    private LocalDateTime createdTime = LocalDateTime.now();

    @NonNull
    private Long ownerId;
}
