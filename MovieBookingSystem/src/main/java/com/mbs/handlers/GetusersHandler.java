package com.mbs.handlers;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.mbs.dao.GetuserDAO;
import com.mbs.utils.RestMetaData;

public class GetusersHandler {
	public void fetch(RestMetaData metaData,HttpServletResponse response) throws IOException
	{
        JSONArray result=GetuserDAO.fetchUsers(metaData);
        try {               
          	JSONObject userResponse = new JSONObject();
          	userResponse.put("success", true);
          	userResponse.put("data", result);
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(userResponse.toString());
        }catch(Exception e)
        {
        	return ;
        }
	}
}
