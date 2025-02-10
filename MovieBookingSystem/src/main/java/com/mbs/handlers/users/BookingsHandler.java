package com.mbs.handlers.users;

import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mbs.dao.users.BookingsDAO;
import com.mbs.utils.RestMetaData;

public class BookingsHandler {
    public void create(RestMetaData metaData, HttpServletResponse response) {
        boolean bookingId = BookingsDAO.createBooking(metaData); // Fetch the data
        JSONObject bookings=new JSONObject();
        try {
        	if(bookingId){
        		bookings.put("success", true);
        		bookings.put("booking_id", bookingId);
    			bookings.put("data", new JSONObject());
        		response.setContentType("application/json");
        		response.setStatus(200);
                response.getWriter().write(bookings.toString());
        	}else {
        		bookings.put("success", false);
    			bookings.put("data", false);
        		response.setContentType("application/json");
        		response.setStatus(401);
                response.getWriter().write(bookings.toString());
	        }
        }catch(Exception e) {
        	e.printStackTrace();
        }
    }
    
    public void fetch(RestMetaData metaData, HttpServletResponse response) {
    	JSONArray result=BookingsDAO.fetchBookings(metaData);
    	JSONObject bookings=new JSONObject();
    	try {
    		if(result!=null){
        		bookings.put("success", true);
    			bookings.put("data", result);
        		response.setContentType("application/json");
        		response.setStatus(200);
                response.getWriter().write(bookings.toString());
    		}
    		else {
        		bookings.put("success", false);
    			bookings.put("data", new JSONObject());
        		response.setContentType("application/json");
        		response.setStatus(401);
                response.getWriter().write(bookings.toString());
    		}
    	}catch(Exception e)
    	{
    		e.printStackTrace();
    	}
    	
    }
    public void update(RestMetaData metaData, HttpServletResponse response) {
    	boolean result=BookingsDAO.updateBooking(metaData);
    	JSONObject bookings=new JSONObject();
    	try {
    		if(result){
        		bookings.put("success", true);
    			bookings.put("data", result);
        		response.setContentType("application/json");
        		response.setStatus(200);
                response.getWriter().write(bookings.toString());
    		}
    		else {
        		bookings.put("success", false);
    			bookings.put("data", new JSONObject());
        		response.setContentType("application/json");
        		response.setStatus(401);
                response.getWriter().write(bookings.toString());
    		}
    	}catch(Exception e)
    	{
    		e.printStackTrace();
    	}
    	
    }

}
