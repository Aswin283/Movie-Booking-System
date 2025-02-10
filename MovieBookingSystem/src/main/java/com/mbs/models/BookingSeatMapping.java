package com.mbs.models;

import com.google.gson.annotations.SerializedName;

public class BookingSeatMapping {
	
    @SerializedName("booking_id")
    private int bookingId;
  
    @SerializedName("seat_id")
    private int seatId;
    
   
    @SerializedName("created_time")
    private long createdTime;
    

    public BookingSeatMapping(int bookingId, int seatId, boolean isCancelled, long createdTime, long modifiedTime) {
        this.bookingId = bookingId;
        this.seatId = seatId;
        this.createdTime = createdTime;
    }

    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public int getSeatId() {
        return seatId;
    }

    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }


    public long getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(long createdTime) {
        this.createdTime = createdTime;
    }


}
