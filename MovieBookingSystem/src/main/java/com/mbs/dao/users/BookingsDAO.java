package com.mbs.dao.users;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.mbs.utils.queryHandler.*;
import com.mbs.models.Booking;
import com.mbs.models.BookingSeatMapping;
import com.mbs.utils.Constants.AggregateFunction;
import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.JsonConverter;
import com.mbs.utils.RestMetaData;

public class BookingsDAO {
	public static boolean checkTickets(JSONArray seatIds) {
		
		
		return true;
	}
	public static boolean createBooking(RestMetaData metaData) {
		JSONObject payloadData=metaData.getPayloadData();
        long currentTime=System.currentTimeMillis();

		try {
	        JSONArray seatIds = payloadData.getJSONArray("seatIds");
	        StringBuilder sb=new StringBuilder();

	        List<Object > values = new ArrayList<>(); 
	        
	        QueryBuilder qb=new QueryBuilder();
	        qb.setAggregateFunction(AggregateFunction.COUNT, "*")
	          .setTableName(TableNames.SEAT)
	          .setCondition(new Condition("seat_id", Operator.IN, seatIds));

	        
	       
	        JSONArray seatsCheck=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues());

	        int checkCount=seatsCheck.getJSONObject(0).getInt("_count") ;
	        if(checkCount!=seatIds.length())
	        {
	        	return false;
	        }

	        for (int i = 0; i < seatIds.length(); i++) {
	            int seatId = seatIds.getInt(i);
	            qb.clear();
					qb.setValue("is_available", false)
		           	 .setValue("modified_time", currentTime)
		             .setTableName(TableNames.SEAT)
		             .setCondition(new Condition("seat_id",Operator.EQUALS,seatId));
		           
		        String query=qb.getUpdateQuery();
		        QueryExecutor.executeUpdate(query, qb.getValues());
	        }
	        
	        
	        //adding entry in booking table
	        payloadData.put("created_time", currentTime);
	        payloadData.put("modified_time", currentTime);
	        
	        Booking booking=JsonConverter.jsonObjectToClassObject(payloadData, Booking.class);

	        int bookingId= QueryExecutor.executeInsert(TableNames.BOOKING, booking,"booking_id");
	        System.out.println("bookingid: "+bookingId);

	        //adding entries in bookingseatmapping
	        JSONObject BSMData=new JSONObject();
	        BSMData.put("booking_id", bookingId);
	        BSMData.put("seat_id", 0);
	        BSMData.put("created_time", currentTime);
	        
	        for (int i = 0; i < seatIds.length(); i++) {
	            int seatId = seatIds.getInt(i);
	        	BSMData.put("seat_id", seatId);

	            BookingSeatMapping bookingSeatMapping=JsonConverter.jsonObjectToClassObject(BSMData, BookingSeatMapping.class);
	             
		        QueryExecutor.executeInsert(TableNames.BOOKING_SEAT_MAPPING, bookingSeatMapping);
	        }
	        return true;

	        
	        
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public static JSONArray fetchBookings(RestMetaData metaData) {
	    QueryBuilder qb = new QueryBuilder();

	    qb.setColumns()
	      .setJoin(new Join(JoinType.INNER, TableNames.BOOKING, TableNames.BOOKING_SEAT_MAPPING, "booking_id", "booking_id"))
	      .setJoin(new Join(JoinType.INNER, TableNames.BOOKING_SEAT_MAPPING, TableNames.SEAT, "seat_id", "seat_id"))
	      .setJoin(new Join(JoinType.INNER, TableNames.BOOKING, TableNames.SHOW, "show_id", "show_id"))
	      .setJoin(new Join(JoinType.INNER, TableNames.SHOW, TableNames.MOVIE, "movie_id", "movie_id"))
	      .setJoin(new Join(JoinType.INNER, TableNames.SHOW, TableNames.THEATRE, "theatre_id", "theatre_id"))
	      .setJoin(new Join(JoinType.INNER, TableNames.THEATRE, TableNames.ADDRESS,"address_id","address_id"))
	      .setCondition(new Condition(TableNames.BOOKING, "customer_id", Operator.EQUALS, metaData.getIdentifiers().get("users")))
	      .addOrderBy("Booking.booking_id DESC");

	    if(metaData.getIdentifiers().containsKey("bookings")) {
	        qb.setCondition(new Condition(TableNames.BOOKING, "booking_id", Operator.EQUALS, metaData.getIdentifiers().get("bookings")));
	    }

	    String query = qb.getSelectQuery();
	    System.out.println(query);
	    try {
	        JSONArray result = QueryExecutor.executeQuery(query, qb.getValues());

	        // Group seat numbers and seat IDs by booking
	        LinkedHashMap<Integer, JSONObject> bookingsMap = new LinkedHashMap<>();

	        for (int i = 0; i < result.length(); i++) {
	            JSONObject row = result.getJSONObject(i);
	            int bookingId = row.getInt("booking_booking_id");

	            if (bookingsMap.containsKey(bookingId)) {
	                JSONObject booking = bookingsMap.get(bookingId);

	                JSONArray seatNumbers = booking.getJSONArray("seats");
	                seatNumbers.put(row.getString("seat_number"));

	                JSONArray seatIds = booking.getJSONArray("seat_ids");
	                seatIds.put(row.getInt("seat_seat_id"));

	            } else {
	            	
	                JSONObject booking = new JSONObject();
	                booking.put("booking_id", row.getInt("booking_booking_id"));
	                booking.put("price", row.getDouble("booking_price"));
	                booking.put("customer_id", row.getInt("booking_customer_id"));
	                booking.put("movie_name", row.getString("movie_movie_name"));
	                booking.put("movie_duration", row.getInt("movie_duration"));
	                booking.put("movie_genre", row.getString("movie_genre"));
	                booking.put("movie_language", row.getString("movie_language"));
	                booking.put("movie_director", row.getString("movie_director"));
	                booking.put("theatre_name", row.getString("theatre_theatre_name"));
	                booking.put("show_timing", row.getLong("show_timing"));
	                booking.put("image_link", row.getString("movie_image_link"));
	                booking.put("is_cancelled", row.getString("booking_is_cancelled"));
	                booking.put("theatre_door_no", row.getString("address_door_no"));
	                booking.put("theatre_street_address", row.getString("address_street_address"));
	                booking.put("theatre_city", row.getString("address_city"));
	                booking.put("theatre_pincode", row.getString("address_pincode"));


	                JSONArray seatNumbers = new JSONArray();
	                seatNumbers.put(row.getString("seat_number"));
	                booking.put("seats", seatNumbers);

	                JSONArray seatIds = new JSONArray();
	                seatIds.put(row.getInt("seat_seat_id"));
	                booking.put("seat_ids", seatIds);

	                bookingsMap.put(bookingId, booking);
	            }
	        }

	        JSONArray groupedBookings = new JSONArray();
	        for (JSONObject booking : bookingsMap.values()) {
	            groupedBookings.put(booking);
	        }

	        return groupedBookings;
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}

	
	public static boolean updateBooking(RestMetaData metaData) {
		
	    QueryBuilder qb = new QueryBuilder();
	    JSONArray seats;
	    long currentTime=System.currentTimeMillis();
		try {
			seats = metaData.getPayloadData().getJSONArray("seat_ids");
	        for (int i = 0; i < seats.length(); i++) {
	            int seat = seats.getInt(i);

			    qb.setTableName(TableNames.SEAT)
			      .setValue("is_available", true)
			      .setValue("modified_time",currentTime)
			      .setCondition(new Condition("seat_id",Operator.EQUALS,seat));
			    	QueryExecutor.executeUpdate(qb.getUpdateQuery(), qb.getValues());
		    }
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	    int bookingId=metaData.getIdentifiers().get("bookings");
	
	    qb.clear();
	    qb.setTableName(TableNames.BOOKING)
	      .setValue("is_cancelled", true)
	      .setValue("modified_time",currentTime)
	      .setCondition(new Condition("booking_id",Operator.EQUALS,bookingId));
		try {
			QueryExecutor.executeUpdate(qb.getUpdateQuery(), qb.getValues());
		} catch (SQLException e) {
			e.printStackTrace();
		}

	    return true;
	}

}