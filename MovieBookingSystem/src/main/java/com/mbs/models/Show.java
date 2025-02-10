package com.mbs.models;

import com.google.gson.annotations.SerializedName;

public class Show {
	
    @SerializedName("timing")
    private long timing;

    @SerializedName("movie_id")
    private int movieId;
    
    @SerializedName("theatre_id")
    private int theatreId;
    
    @SerializedName("is_cancelled")
    private boolean isCancelled;
    
    @SerializedName("created_time")
    private long createdTime;
    
    @SerializedName("modified_time")
    private long modifiedTime;	

    public Show(long timing, int movieId, int theatreId, boolean isCancelled, long createdTime, long modifiedTime) {
        this.timing = timing;
        this.movieId = movieId;
        this.theatreId = theatreId;
        this.isCancelled = isCancelled;
        this.createdTime = createdTime;
        this.modifiedTime = modifiedTime;
    }

    public long getTiming() {
        return timing;
    }

    public void setTiming(long timing) {
        this.timing = timing;
    }

    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public int getTheatreId() {
        return theatreId;
    }

    public void setTheatreId(int theatreId) {
        this.theatreId = theatreId;
    }

    public boolean isCancelled() {
        return isCancelled;
    }

    public void setCancelled(boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public long getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(long createdTime) {
        this.createdTime = createdTime;
    }

    public long getModifiedTime() {
        return modifiedTime;
    }

    public void setModifiedTime(long modifiedTime) {
        this.modifiedTime = modifiedTime;
    }
}
