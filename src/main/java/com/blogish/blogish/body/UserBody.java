package com.blogish.blogish.body;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class UserBody {
    @NonNull
    private String nickname;

    @NonNull
    private String userId;

    @Builder.Default
    private boolean deleted = false;
}
