package com.mbs.models;

import com.google.gson.annotations.SerializedName;

public class Theatre {
	
    @SerializedName("theatre_name")
    private String theatreName;
    
    @SerializedName("address_id")
    private int addressId;
    
    private Address address;
    
    @SerializedName("screen_rows")
    private int screenRows;
    
    @SerializedName("screen_columns")
    private int screenColumns;
    
    @SerializedName("manager_id")
    private int managerId;
    
    @SerializedName("created_time")
    private long createdTime;
    
    @SerializedName("modified_time")
    private long modifiedTime;

    public Theatre(String name,String doorNo, String streetAddress, int city, int pincode, int screenRows, int screenColumns, int managerId, long createdTime, long modifiedTime) {
        this.theatreName = name;
        this.address = new Address(doorNo,streetAddress,city,pincode);
        this.screenRows = screenRows;
        this.screenColumns = screenColumns;
        this.managerId = managerId;
        this.createdTime = createdTime;
        this.modifiedTime = modifiedTime;
    }

    public String getName() {
        return theatreName;
    }

    public void setName(String name) {
        this.theatreName = name;
    }

    public Address getAddressId() {
        return address;
    }

    public void setAddressId(Address address) {
        this.address = address;
    }

    public int getScreenRows() {
        return screenRows;
    }

    public void setScreenRows(int screenRows) {
        this.screenRows = screenRows;
    }

    public int getScreenColumns() {
        return screenColumns;
    }

    public void setScreenColumns(int screenColumns) {
        this.screenColumns = screenColumns;
    }

    public int getManagerId() {
        return managerId;
    }

    public void setManagerId(int managerId) {
        this.managerId = managerId;
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
