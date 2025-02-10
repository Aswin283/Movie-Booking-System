package com.mbs.models;

import com.google.gson.annotations.SerializedName;

public class Booking {

	@SerializedName("price")
    private double price;
    
	@SerializedName("customer_id")
    private int customerId;
    
    @SerializedName("show_id")
    private int showId;
    
    @SerializedName("is_cancelled")
    private boolean isCancelled;
    
    @SerializedName("created_time")
    private long createdTime;
    
    @SerializedName("modified_time")
    private long modifiedTime;
    
    public Booking(int bookingId, int customerId, int showId, double price, boolean isCancelled, long bookingDate, long createdTime, long modifiedTime) {
        this.customerId = customerId;
        this.showId = showId;
        this.price = price;
        this.isCancelled = isCancelled;
        this.createdTime = createdTime;
        this.modifiedTime = modifiedTime;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getShowId() {
        return showId;
    }

    public void setShowId(int showId) {
        this.showId = showId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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
