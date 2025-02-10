package com.mbs.utils;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class GroupShows {

    public static JSONObject groupShows(JSONArray result,String table) {
        Map<String, JSONArray> showsMap = new HashMap<>();
        JSONObject resultData = new JSONObject();

        try {
            for (int i = 0; i < result.length(); i++) {
                JSONObject show = result.getJSONObject(i);
                String groupName = show.getString(table);

                JSONObject showDetails = new JSONObject();
                showDetails.put("show_id", show.getInt("show_show_id"));
                showDetails.put("timing", show.getLong("show_timing")); // Timestamp for show time
                showDetails.put("is_cancelled", show.getBoolean("show_is_cancelled"));
                showDetails.put("theatre_id", show.getInt("show_theatre_id"));
                showDetails.put("movie_id", show.getInt("show_movie_id"));
                if(show.has("movie_image_link"))
                {
                    showDetails.put("movie_link", show.getString("movie_image_link"));                	
                }
                showDetails.put("screen_rows", show.getInt("theatre_screen_rows"));
                showDetails.put("screen_columns", show.getInt("theatre_screen_columns"));
                
                showsMap
                    .computeIfAbsent(groupName, k -> new JSONArray())
                    .put(showDetails); // Add the show details to the list
            }

            for (Map.Entry<String, JSONArray> entry : showsMap.entrySet()) {
            	resultData.put(entry.getKey(), entry.getValue());
            }

            System.out.println(resultData);
        }catch(Exception e)
        {
        	e.printStackTrace();
        }  
        return resultData;        	
    }
}
