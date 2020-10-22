package com.blogish.blogish.dto;

import com.blogish.blogish.body.BlogRequestBody;
import com.blogish.blogish.body.BlogResponseBody;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class Blog {
    @Builder.Default
    private Long id = -1L;

    @NonNull
    private String title;

    @Builder.Default
    private String description = "";

    @Builder.Default
    private LocalDateTime createdTime = LocalDateTime.now();

    @NonNull
    private Long ownerId;

    public static Blog create(BlogRequestBody blogReq, Long ownerId) {
        return Blog.builder()
                .title(blogReq.getTitle())
                .description(blogReq.getDescription())
                .ownerId(ownerId)
                .build();
    }

    public static Blog fetch(BlogResponseBody blogResp) {
        return Blog.builder()
                .id(blogResp.getId())
                .title(blogResp.getTitle())
                .description(blogResp.getDescription())
                .createdTime(blogResp.getCreatedTime())
                .ownerId(blogResp.getOwner().getId())
                .build();
    }
}
