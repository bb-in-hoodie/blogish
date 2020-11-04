package com.blogish.blogish.body;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class BlogRequestBody {
    @NonNull
    private String title;

    @Builder.Default
    private String description = "";

    @NonNull
    private String userId;
}
