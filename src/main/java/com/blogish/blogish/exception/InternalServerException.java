package com.blogish.blogish.exception;

public class InternalServerException extends RuntimeException {
    public InternalServerException() { super(); }
    public InternalServerException(String message) {
        super(message);
    }
}
