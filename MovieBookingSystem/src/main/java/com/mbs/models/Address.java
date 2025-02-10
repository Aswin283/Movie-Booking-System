package com.mbs.models;

import com.google.gson.annotations.SerializedName;

public class Address {
    @SerializedName("door_no")
    private String doorNo;
    
    @SerializedName("street_address")
    private String streetAddress;

    @SerializedName("city")
    private int city;
    
    @SerializedName("pincode")
    private int pincode;
    
    @SerializedName("created_time")
    private long createdTime;
    
    @SerializedName("modified_time")
    private long modifiedTime;
    

    public Address(String doorNo, String streetAddress, int city, int pincode) {
        this.doorNo = doorNo;
        this.streetAddress = streetAddress;
        this.city = city;
        this.pincode = pincode;
        long currentTimeMillis = System.currentTimeMillis();
        this.createdTime = currentTimeMillis;
        this.modifiedTime = currentTimeMillis;
    }

    public String getDoorNo() {
        return doorNo;
    }

    public void setDoorNo(String doorNo) {
        this.doorNo = doorNo;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public int getCity() {
        return city;
    }

    public void setCity(int city) {
        this.city = city;
    }

    public int getPincode() {
        return pincode;
    }

    public void setPincode(int pincode) {
        this.pincode = pincode;
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
