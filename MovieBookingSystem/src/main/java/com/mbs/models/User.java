package com.mbs.models;
import com.google.gson.annotations.SerializedName;

public class User {
	
    @SerializedName("first_name")
    private String firstName;
	
    @SerializedName("last_name")
    private String lastName;
    
    @SerializedName("pno")
    private long phoneNumber;
    
    @SerializedName("address_id")
    private int addressId;
    
    private Address address;
    
    @SerializedName("password")
    private String password;
    
    @SerializedName("type")
    private int type; 
    
    @SerializedName("created_time")
    private long createdTime;
    
    @SerializedName("modified_time")
    private long modifiedTime;
   
    
    public User(String firstName, String lastName,long phoneNumber, String doorNo, String streetAddress, int city, int pincode, String password,int type) {
        this.firstName = firstName;
        this.lastName=lastName;
        this.phoneNumber = phoneNumber;
        Address address=new Address(doorNo,streetAddress,city,pincode);
        this.address=address;
        this.password = password;
        this.type=type;
        long currentTimeMillis = System.currentTimeMillis();
        this.createdTime=currentTimeMillis;
        this.modifiedTime=currentTimeMillis;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.firstName = lastName;
    }
    
    public String getFullName()
    {
    	return this.firstName+" "+this.lastName;
    }
    
    public long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDoorNo() {
        return this.address.getDoorNo();
    }

    public void setDoorNo(String doorNo) {
    	this.address.setDoorNo(doorNo);
    }
    
    public int getAddressId() {
        return this.addressId;
    }

    public void setAddressId(int addressId) {
    	this.addressId=addressId;
    }
    public String getStreetAddress() {
        return this.address.getStreetAddress();
    }

    public void setStreetAddress(String streetAddress) {
    	this.address.setStreetAddress(streetAddress);
    }

    public int getCity() {
        return this.address.getCity();
    }

    public void setCity(int city) {
        this.address.setCity(city);
    }

    public int getPincode() {
        return this.address.getPincode();
    }

    public void setPincode(int pincode) {
    	this.address.setPincode(pincode);
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public int getType()
    {
    	return type;
    }
    public void setType(int type)
    {
    	this.type=type;
    }
    public long getCreatedTime()
    {
    	return createdTime;
    }
    public void setCreatedTime(long createdTime)
    {
    	this.createdTime=createdTime;
    }
    public long getModifiedTime()
    {
    	return modifiedTime;
    }
    public void setModifiedTime(long modifiedTime)
    {
    	this.modifiedTime=modifiedTime;
    }
}
