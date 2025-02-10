package com.mbs.models;

import com.google.gson.annotations.SerializedName;

public class Seat {
    @SerializedName("show_id")
    private int showId;

    @SerializedName("number")
    private String number;
    
    @SerializedName("price")
    private float price;
    
    @SerializedName("is_available")
    private boolean isAvailable;
    
    @SerializedName("created_time")
    private long createdTime;
    
    @SerializedName("modified_time")
    private long modifiedTime;

    public Seat(int showId, String number, int price, boolean isAvailable, long createdTime, long modifiedTime) {
        this.showId = showId;
        this.number = number;
        this.price = price;
        this.isAvailable = isAvailable;
        this.createdTime = createdTime;
        this.modifiedTime = modifiedTime;
    }

    public int getShowId() {
        return showId;
    }

    public void setShowId(int showId) {
        this.showId = showId;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
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
