package com.mbs.handlers;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import com.mbs.dao.AuthenticationDAO;
import com.mbs.models.Address;
import com.mbs.models.User;
import com.mbs.utils.JsonConverter;
import com.mbs.utils.PasswordUtil;
import com.mbs.utils.Constants.City;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.EncryptionDecryption;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;
import java.util.ArrayList;

public class AuthenticationHandler {
    private JSONObject payloadData;
    private HttpServletResponse response;
    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);
    public AuthenticationHandler(JSONObject payloadData, HttpServletResponse response)
    {
    	this.payloadData=payloadData;
    	this.response=response;
    }

    public static boolean isValidPhoneNumber(long phoneNumber) {
        String phoneNumberStr = String.valueOf(phoneNumber);
        String phoneRegex = "^[0-9]{10}$";
        return phoneNumberStr.matches(phoneRegex);
    }
    
    public JSONArray login() {
        JSONArray userDetails = null;
        try {
            long pno = payloadData.getLong("pno");
            String password = payloadData.getString("password");

            userDetails = AuthenticationDAO.authenticateUser(pno, password);
            if (userDetails != null) {
            	logger.info("Login Success");
                String userId = String.valueOf(userDetails.getJSONObject(0).get("USER_user_id"));
                String encryptedUserId = EncryptionDecryption.encrypt(userId, EncryptionDecryption.getFixedSecretKey());

                Cookie userSessionCookie = new Cookie("userSession", encryptedUserId);
                
                userSessionCookie.setPath("/");
                userSessionCookie.setMaxAge(86500); // Set cookie expiration
                userSessionCookie.setSecure(false);
                userSessionCookie.setHttpOnly(true);
                
                response.setContentType("application/json");
                response.addCookie(userSessionCookie);
                response.setHeader("Access-Control-Allow-Credentials", "true");
                response.setCharacterEncoding("UTF-8");
                response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200"); // or your Ember app origin
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
            	logger.info("Login failed");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid username or password.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        return userDetails;
    }

    public void logout() {
        try {
            Cookie sessionCookie = new Cookie("userSession", null);
            sessionCookie.setPath("/");
            sessionCookie.setHttpOnly(true);
            sessionCookie.setSecure(true);
            sessionCookie.setMaxAge(0); 

            response.addCookie(sessionCookie);
            response.setHeader("Set-Cookie", "userSession=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("{\"status\":\"success\",\"message\":\"You have been logged out\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    
	public JSONObject register() {

        try {		
        	JSONArray doesUserExist=AuthenticationDAO.getUserByPno(payloadData.getLong("pno"));
    		if (doesUserExist==null || doesUserExist.length()==0)
    		{
    		    try{
    		        long currentTimeMillis = System.currentTimeMillis();

    	        	int addressId=0;
    		        try {
    		        	
    		        	JSONObject addressObject=payloadData.getJSONObject("address");
    		        	addressObject.put("city", City.fromString(addressObject.getString("city").toLowerCase()).getValue());
    		        	addressObject.put("created_time",currentTimeMillis);
    		        	addressObject.put("modified_time",currentTimeMillis);
    		        	
    		        	Address address=JsonConverter.jsonObjectToClassObject(addressObject, Address.class);
    		        	if(address.getCity()==0)
    		        	{
    		        		JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Fill all required fields");
            				return result;
    		        	}
    		        	addressId=QueryExecutor.executeInsert(TableNames.ADDRESS, address,"address_id"); 

    		        } catch (Exception e) {
    		            System.out.println("Error occurred at createUser try 1: " + e);
    		            e.printStackTrace();
    		        }

    		        try {
    		        	String orginalPassword=payloadData.getString("password");
    		        	payloadData.put("created_time", currentTimeMillis);
    			    	payloadData.put("modified_time", currentTimeMillis);
    		        	payloadData.put("address_id",addressId);
        	        	payloadData.put("password", PasswordUtil.hashPassword(payloadData.getString("password")));

    		            QueryBuilder qb = new QueryBuilder();
    		            User user=JsonConverter.jsonObjectToClassObject(payloadData, User.class);
    		            
    		            if(user.getFirstName()==null || user.getPhoneNumber()==0)
    		            {
    		           		JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Fill all required fields");
            				return result;
    		            }
    		            if(!isValidPhoneNumber(user.getPhoneNumber()))
    		            {
    		            	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Invalid Phone Number");
            				return result;
    		            }
    		            if(user.getType()==0)
    		            {
    		            	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Invalid attempt");
            				return result;
    		            }
    		            if (!orginalPassword.equals(payloadData.getString("confirm_password"))) {
    		            	System.out.println(orginalPassword+" "+payloadData.getString("confirm_password"));
    		               	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Both passwords are not matching");
            				return result;
    		            }
//    		            if(!PasswordUtil.passwordValidityChecker(orginalPassword))
//    		            {
//    		              	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Password must be at least 8 characters long, include a letter, a number, and a special symbol.");
//            				return result;
//    		            }
    		            QueryExecutor.executeInsert(TableNames.USER, user);
    		        	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 200, true, "Registered Successfully!");
    	    			return result;
    		        } catch (Exception e) {
    		        	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Registeration Unsuccessfull");
        				return result;
    		        }

    		    } catch (Exception e) {
    		    	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Registeration Unsuccessfull");
    				return result;
    		    }
    			
    		}
    		else {
    			JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "User Already Exists with this phone number");
    			return result;
    		}
        	
        }catch(Exception e)
        {
        	JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Registeration Unsuccessfull");
			return result;
        }


	}
}
