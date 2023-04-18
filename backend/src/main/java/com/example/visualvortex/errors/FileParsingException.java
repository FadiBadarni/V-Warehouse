package com.example.visualvortex.errors;

public class FileParsingException extends RuntimeException {
    public FileParsingException(String message, Throwable cause) {
        super(message, cause);
    }
}
