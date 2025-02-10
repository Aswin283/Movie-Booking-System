package com.mbs.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

public class JsonConverter {

	public static JSONArray resultSetToJson(ResultSet rs) throws JSONException {
	    JSONArray rowsArray = new JSONArray();

	    try {
	        int columnCount = rs.getMetaData().getColumnCount();

	        while (rs.next()) {
	            JSONObject rowObject = new JSONObject();
	            System.out.println("Column count :"+columnCount);
	            for (int i = 1; i <= columnCount; i++) {
	                String columnLabel = rs.getMetaData().getTableName(i) + "_" + rs.getMetaData().getColumnName(i);
	                Object columnValue = rs.getObject(i);
	                System.out.println(columnLabel + " " + columnValue);
	                rowObject.put(columnLabel, columnValue); 
	            }

	            rowsArray.put(rowObject);
	        }


	    } catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return rowsArray;
	}
	public static JSONObject ajaxDataToJson(InputStream inputStream) throws JSONException {
	    JSONObject jsonObject = null;

	    try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
	        StringBuilder stringBuilder = new StringBuilder();
	        String line;

	        while ((line = reader.readLine()) != null) {
	            stringBuilder.append(line);
	        }

	        String jsonString = stringBuilder.toString();

	        System.out.println("Raw JSON String: " + jsonString);

	        if (jsonString.trim().startsWith("[")) {
	            JSONArray jsonArray = new JSONArray(jsonString);
	            if (jsonArray.length() > 0) {
	                jsonObject = jsonArray.getJSONObject(0); 
	            } else {
	                throw new JSONException("JSONArray is empty");
	            }
	        } else {
	        	if(jsonString.length()!=0) {
	        		jsonObject = new JSONObject(jsonString);
	        	}
	        }

	    } catch (IOException e) {
	        System.err.println("Error reading from input stream: " + e.getMessage());
	        e.printStackTrace();
	    }

	    return jsonObject;  
	}

    public static <T> T jsonObjectToClassObject(JSONObject jsonObject, Class<T> classType) {
        Gson gson = new Gson();
        T object = null;
        try {
            object = gson.fromJson(jsonObject.toString(), classType);
        } catch (JsonSyntaxException e) {
            System.out.println("Error converting JSONObject to class object: " + e.getMessage());
        }
        return object;
    }
    
    
}
