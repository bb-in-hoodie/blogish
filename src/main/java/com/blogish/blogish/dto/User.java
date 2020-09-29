package com.blogish.blogish.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class User {
    @Builder.Default
    private Long id = -1L;

    @NonNull
    private String nickname;

    @NonNull
    private String userId;

    @Builder.Default
    private String password = null;

    @Builder.Default
    private boolean deleted = false;
}
