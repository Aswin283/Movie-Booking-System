package com.mbs.handlers.theatres;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.dao.TheatresDAO;
import com.mbs.dao.theatres.ShowsDAO;
import com.mbs.dao.users.BookingsDAO;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.GetConnection;
import com.mbs.utils.RestMetaData;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class ShowsHandler{
	
	   public void create(RestMetaData metaData,HttpServletResponse response) {
		   
	    	try {
		        JSONObject result=ShowsDAO.createShow(metaData);
				response.setStatus(result.getInt("status"));
		    	response.getWriter().write(result.toString());

			} catch (Exception e) {
				e.printStackTrace();
			}

	    }
	   
	   public void fetch(RestMetaData metaData,HttpServletResponse response) throws IOException {
	        JSONArray result=ShowsDAO.fetchShow(metaData);
	        JSONObject shows=new JSONObject();
	        try {
	        	shows.put("success", true);
	        	shows.put("data",result);
	            response.setContentType("application/json");
	            response.setStatus(HttpServletResponse.SC_OK);
	            response.getWriter().write(shows.toString());

			} catch (JSONException e) {
				e.printStackTrace();
			}
	   }

	   
	   public void update(RestMetaData metaData,HttpServletResponse response) {
	    	try {
		    	JSONObject result=ShowsDAO.deleteShow(metaData);
				response.setStatus(result.getInt("status"));
		    	response.getWriter().write(result.toString());

			} catch (Exception e) {
				e.printStackTrace();
			}
	   }


}
