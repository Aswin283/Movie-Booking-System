package com.mbs.handlers.movies.shows;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.dao.movies.shows.SeatsDAO;
import com.mbs.utils.RestMetaData;

public class SeatsHandler {
	
	public void fetch(RestMetaData metaData,HttpServletResponse response) throws IOException
	{
		JSONArray result=SeatsDAO.fetchSeats(metaData);
		JSONObject seats=new JSONObject();
		try {
	        if (result.length() > 0) {

			seats.put("success", true);
			seats.put("data", result);
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            // Write the JSON response to the output stream
            response.getWriter().write(seats.toString());

	        }
	        else {
	            // Handle case when no data is found
	            JSONObject errorResponse = new JSONObject();
	            errorResponse.put("success", false);
	            errorResponse.put("message", "No theatres found.");
	            response.setContentType("application/json");
	            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	            response.getWriter().write(errorResponse.toString());
	        }
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
