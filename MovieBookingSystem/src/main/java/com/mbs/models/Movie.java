package com.mbs.models;

import java.lang.reflect.Field;

import com.google.gson.annotations.SerializedName;

public class Movie {

    @SerializedName("movie_name")
    private String movieName;

    @SerializedName("duration")
    private long duration; // Duration in minutes or milliseconds as per your use case
    
    @SerializedName("language")
    private String language;
    
    @SerializedName("created_time")
    private long createdTime;

    @SerializedName("genre")
    private String genre; // Added genre property

    @SerializedName("director")
    private String director; // Added directorName property
    
    @SerializedName("image_link")
    private String imageLink;

    // Updated constructor to include genre and directorName
    public Movie(String name, long duration, String language, long createdTime, String genre, String director,String imageLink) {
        this.movieName = name;
        this.duration = duration;
        this.language = language;
        this.createdTime = createdTime;
        this.genre = genre; // Initialize genre
        this.director = director; // Initialize directorName
        this.imageLink=imageLink;
    }

    // Existing getters and setters
    public String getName() {
        return movieName;
    }

    public void setName(String name) {
        this.movieName = name;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public long getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(long createdTime) {
        this.createdTime = createdTime;
    }

    // Getter and setter for genre
    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    // Getter and setter for directorName
    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }
}
