package com.blogish.blogish.body;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class UserBody {
    @Builder.Default
    private Long id = -1L;

    @NonNull
    private String nickname;

    @NonNull
    private String userId;
}
