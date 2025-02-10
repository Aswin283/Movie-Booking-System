package com.mbs.handlers.users;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.dao.users.UpdateDAO;
import com.mbs.utils.RestMetaData;

public class UpdateHandler {
	
	   public void update(RestMetaData metaData,HttpServletResponse response)  {
		   try {
			   JSONObject result=UpdateDAO.updateProfile(metaData);
			   response.setStatus(result.getInt("status"));
			   response.getWriter().write(result.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	   }

}
