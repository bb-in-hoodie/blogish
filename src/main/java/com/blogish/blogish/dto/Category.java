package com.blogish.blogish.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class Category {
    @Builder.Default
    private Long id = -1L;

    @NonNull
    private String name;

    @NonNull
    private Long blogId;
}
