package com.blogish.blogish.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class Category {
    public static String DEFAULT_CATEGORY_NAME = "default";

    @Builder.Default
    private Long id = -1L;

    @NonNull
    private String name;

    @NonNull
    private Long blogId;
}
