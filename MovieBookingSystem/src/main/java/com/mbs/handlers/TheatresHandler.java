package com.mbs.handlers;

import java.io.IOException;
import com.mbs.utils.CreateResponseJSONObject;
import java.util.Arrays;
import javax.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.mbs.dao.TheatresDAO;
import com.mbs.utils.GroupShows;
import com.mbs.utils.RestMetaData;

public class TheatresHandler {
    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);

    public void fetch(RestMetaData metaData, HttpServletResponse response) {
        JSONArray result = TheatresDAO.fetchTheatre(metaData); // Fetch the data
        int status=0;
        boolean success=true;
        if (result!=null)
        {
        	status=HttpServletResponse.SC_OK;
        	success=true;
        }
        else {
        	status=HttpServletResponse.SC_OK;
        	success=false;
        }
    	JSONObject theatresResponse = CreateResponseJSONObject.createResponse(result, status, success,"");
    	try {
            if(metaData.getInclude()!=null && Arrays.asList(metaData.getInclude()).contains("shows")){
                JSONObject groupedShows = GroupShows.groupShows(result,"theatre_theatre_name");            		
                theatresResponse.put("data", groupedShows);
        	}else{
                theatresResponse.put("data", result);
        	}
    	}catch(Exception e){
    		logger.info("Theatre adding failed :"+e);
    	}

    	try {
            response.setContentType("application/json");
        	response.setStatus(status);
			response.getWriter().write(theatresResponse.toString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }


    public void create(RestMetaData metaData, HttpServletResponse response) {
    	try {
        	JSONObject result=TheatresDAO.createTheatre(metaData);
			response.setStatus(result.getInt("status"));
			response.getWriter().write(result.toString());

		} catch (Exception e) {
			e.printStackTrace();
		}


  
    }

    public void update(RestMetaData metaData, HttpServletResponse response) {
        
        System.out.println("inside update method in theatresHandler");
        try {
        	TheatresDAO.updateTheatre(metaData);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Operation successful");
        } catch (IOException e) {
            System.out.println("mbs.handlers.Theatres.java => update method invoked successfully");
            e.printStackTrace();
        }
    }
}
