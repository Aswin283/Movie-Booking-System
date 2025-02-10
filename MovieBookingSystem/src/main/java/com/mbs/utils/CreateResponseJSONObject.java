package com.mbs.utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class CreateResponseJSONObject {
	public static JSONObject createResponse(JSONArray data,int status,boolean success,String message){
		JSONObject response=new JSONObject();
		try {
			response.put("success", success);
			response.put("data", data);
			response.put("status",status);
			response.put("message", message);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return response;
	}

}
