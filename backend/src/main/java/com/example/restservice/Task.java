package com.example.restservice;

public record Task(long id, String title, String description, String dueDate, Boolean completed) { }

