package com.mbs.dao;

import java.util.HashMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mbs.handlers.AuthenticationHandler;
import com.mbs.models.Movie;
import com.mbs.utils.JsonConverter;
import com.mbs.utils.RestMetaData;
import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.DateRange;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class MoviesDAO {
    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);
	public static JSONArray fetchMovie(RestMetaData metaData) {
        QueryBuilder qb = new QueryBuilder();
	    JSONArray result = new JSONArray();
	    HashMap<String,String> filters=metaData.getFilters();
	    String [] include=metaData.getInclude();
	    HashMap<String,Integer> identifiers = metaData.getIdentifiers();

	    try{
    		if(include!=null) {
    			if(include[0].equals("all")){
    	    	qb.setColumns()
  	    	  .setTableName(TableNames.MOVIE);
    	        String query = qb.getSelectQuery();
    	        result =QueryExecutor.executeQuery(query,qb.getValues());
    	        return result;
    			}
    		}
	
		    qb.setColumns()
	          .setJoin(new Join(JoinType.INNER,TableNames.MOVIE,TableNames.SHOW,"movie_id","movie_id"))
	          .setJoin(new Join(JoinType.INNER,TableNames.SHOW,TableNames.THEATRE,"theatre_ID","theatre_id"))
		      .setCondition(new Condition(TableNames.SHOW,"is_cancelled",Operator.EQUALS,false))
		      .setCondition(new Condition(TableNames.SHOW,"timing",Operator.GREATER_THAN,System.currentTimeMillis()));
		    
    		if(filters!=null)
    		{
	    		if(filters.containsKey("theatres"))
	    		{
	    			qb.setCondition(new Condition(TableNames.SHOW,"theatre_id",Operator.EQUALS,Integer.parseInt(filters.get("theatres"))));
	    		}
	    		if(filters.containsKey("date"))
	    		{
	    			long []duration=DateRange.calculateDayStartAndEndFromDate(filters.get("date"));
		        	long dayStart=duration[0];
		        	long dayEnd=duration[1];
		        	long currenTime = System.currentTimeMillis();
		        	if(currenTime > dayStart && currenTime < dayEnd) {
		        		dayStart = currenTime;
		        	}
		        	qb.setCondition(new Condition(TableNames.SHOW,"timing",Operator.GREATER_THAN_OR_EQUAL,dayStart))
		        	  .setCondition(new Condition(TableNames.SHOW,"timing",Operator.LESS_THAN_OR_EQUAL,dayEnd));
	    		}
    		}

    		
    	    if (include==null || include.length==0)
  	        {
  	        		qb.setDistinct("movie_name");
  	        }
    	      
  	        if (identifiers != null && identifiers.containsKey("movies")) {
  	        	qb.setCondition(new Condition("movie_id", Operator.EQUALS,identifiers.get("movies")));
  	        }
		
  	        String query = qb.getSelectQuery();
    	
        result =QueryExecutor.executeQuery(query,qb.getValues());
	        
	    } catch (Exception e) {
	    	logger.error("Error occurred in fetchMovie: " + e);
	    }

	    return result;
	}

	public static JSONObject createMovie(RestMetaData metaData) {

	    try{
			JSONObject payloadData=metaData.getPayloadData();
			
	        long currentTimeMillis = System.currentTimeMillis();
			payloadData.put("created_time", currentTimeMillis);
	
			Movie movie=JsonConverter.jsonObjectToClassObject(payloadData, Movie.class);

			if(movie.getName()==null || movie.getLanguage()==null || movie.getGenre()==null || movie.getDuration() == 0 || movie.getDirector() == null)
			{
		    	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Please fill all required fields");
				return response;
			}

			//check if the movie already exists
			QueryBuilder qb=new QueryBuilder();
			qb.setTableName(TableNames.MOVIE)
			  .setCondition(new Condition("movie_name",Operator.EQUALS,movie.getName()))
			  .setCondition(new Condition("language",Operator.EQUALS,movie.getLanguage()));
			
			JSONArray movieCheck = QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues());
			if(movieCheck.length()!=0)
			{
			 	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false,"Movie already exist");
		    	return response;		
			}
            QueryExecutor.executeInsert(TableNames.MOVIE, movie);
	    	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 200, true, "Movie added Successfully!");
	    	return response;
			
		} catch (Exception e) {
			logger.error(e);
	    	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Movie adding unsuccessfull");
			return response;
		}
	}


}
