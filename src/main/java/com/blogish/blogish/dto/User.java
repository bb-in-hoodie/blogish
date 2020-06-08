package com.blogish.blogish.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
public class User {
    @NonNull
    private String nickname;

    @NonNull
    private String userId;

    @Builder.Default
    private String password = null;

    @Builder.Default
    private boolean deleted = false;
}
