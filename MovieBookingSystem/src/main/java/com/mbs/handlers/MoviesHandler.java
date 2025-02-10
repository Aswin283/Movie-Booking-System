package com.mbs.handlers;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.dao.MoviesDAO;
import com.mbs.utils.GroupShows;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.RestMetaData;

public class MoviesHandler {
	
    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);
	public void fetch(RestMetaData metaData,HttpServletResponse response) throws IOException
	{
        JSONArray result=MoviesDAO.fetchMovie(metaData);
        int status=0;
        boolean success=true;
        if (result!=null)
        {
        	status=HttpServletResponse.SC_OK;
        	success=true;
        }
        else {
        	System.out.println("THIS IS THE TREASOn");
        	status=HttpServletResponse.SC_OK;
        	success=false;
        }
    	JSONObject movieResponse = CreateResponseJSONObject.createResponse(result, status, success,"");
      	try {
          	if(metaData.getInclude()!=null && Arrays.asList(metaData.getInclude()).contains("shows"))
          	{
                JSONObject groupedShows = GroupShows.groupShows(result,"movie_movie_name");            		
                movieResponse.put("data", groupedShows);
          	}else{
          		movieResponse.put("data", result);                      
          	}
         }catch(Exception e){
     		logger.info("movie adding failed :"+e);

          	}
          	try {
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(movieResponse.toString());
          		
          	} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
    public void create(RestMetaData metaData,HttpServletResponse response) throws IOException {
    	try {
        	JSONObject result=MoviesDAO.createMovie(metaData);	
        	System.out.println(result.getInt("status"));
			response.setStatus(result.getInt("status"));
			System.out.println(result.toString());
	    	response.getWriter().write(result.toString());
	    	
		} catch (JSONException e) {
			e.printStackTrace();
		}
    }
    
}
