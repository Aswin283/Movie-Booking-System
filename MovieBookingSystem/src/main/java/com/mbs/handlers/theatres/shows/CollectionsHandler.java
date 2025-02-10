package com.mbs.handlers.theatres.shows;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.dao.theatres.shows.CollectionsDAO;
import com.mbs.utils.RestMetaData;

public class CollectionsHandler {
	   public void fetch(RestMetaData metaData,HttpServletResponse response) throws IOException {
		    JSONArray result=CollectionsDAO.fetchCollections(metaData);
		    JSONObject collectionResponse=new JSONObject();
		    try {
				if(result!=null){
					collectionResponse.put("success", true);
					collectionResponse.put("data", result);
	        		response.setContentType("application/json");
	        		response.setStatus(200);
	                response.getWriter().write(collectionResponse.toString());
	    		}
	    		else {
	    			collectionResponse.put("success", false);
	    			collectionResponse.put("data", new JSONObject());
	        		response.setContentType("application/json");
	        		response.setStatus(401);
	                response.getWriter().write(collectionResponse.toString());
	    		}
		    	
		    }catch(Exception e)
		    {
		    	e.printStackTrace();
		    }
	     
	   }
}
