package com.blogish.blogish.body;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class LoginResultBody {
    @NonNull
    private Boolean succeeded;

    private UserBody user = null;
}
