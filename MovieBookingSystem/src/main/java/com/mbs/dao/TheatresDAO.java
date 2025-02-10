package com.mbs.dao;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mbs.utils.Constants.City;
import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.LogicalOperator;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.DateRange;
import com.mbs.handlers.AuthenticationHandler;
import com.mbs.models.Address;
import com.mbs.models.Theatre;
import com.mbs.utils.JsonConverter;
import com.mbs.utils.RestMetaData;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class TheatresDAO {
    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);

	public static JSONArray fetchTheatre(RestMetaData metaData) {
	    JSONArray result = new JSONArray();

	    try{

	        HashMap<String, String> filters = metaData.getFilters(); 
	        String[] include = metaData.getInclude(); 
	        HashMap<String,Integer> identifiers = metaData.getIdentifiers();

	        QueryBuilder qb = new QueryBuilder();

	        qb.setColumns(); 
	        qb.setJoin(new Join(JoinType.INNER, TableNames.THEATRE, TableNames.ADDRESS, "address_id", "address_id"));


	        if (include!=null && include.length!=0)
	        {
	        	System.out.println("INCLUDES :"+include.toString()+"\n"+Arrays.asList(include).toString());
	        	if(Arrays.asList(include).contains("manager"))//for fetching theatres for super admin
       			{
		        	qb.setJoin(new Join(JoinType.INNER,TableNames.THEATRE,TableNames.USER,"manager_id","user_id"));	        		
       			}
	        	if(Arrays.asList(include).contains("shows"))
	        	{
	  	          qb.setJoin(new Join(JoinType.INNER,TableNames.THEATRE,TableNames.SHOW,"theatre_id","theatre_id"))
	  	          .setCondition(new Condition(TableNames.SHOW,"movie_id",Operator.EQUALS,Integer.parseInt(filters.get("movies"))));
	  	          
	  	          qb.setCondition(new Condition(TableNames.SHOW,"is_cancelled",Operator.EQUALS,false));

	        	}
	        }
	        if (filters != null ) {
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
	        	if(filters.containsKey("city")) 
	        	{
		            qb.setCondition(new Condition(TableNames.ADDRESS, "city", Operator.EQUALS,LogicalOperator.AND,filters.get("city")));
	        	}
	        	if(filters.containsKey("name")) {
		            qb.setCondition(new Condition(TableNames.THEATRE, "name", Operator.EQUALS,filters.get("name")));
		        }
	        	if(identifiers.containsKey("theatres")) {
		            qb.setCondition(new Condition(TableNames.THEATRE, "theatre_id", Operator.EQUALS,identifiers.get("theatres")));
		        }
	        }
	        String query = qb.getSelectQuery();
	        result=QueryExecutor.executeQuery(query, qb.getValues());
	        
	    } catch (Exception e) {
	    	logger.error("Error occurred in fetchTheatre: " + e);
	    }
	     
	    return result;
	}
	
	public static JSONObject createTheatre(RestMetaData metaData) {
		JSONObject payloadData=metaData.getPayloadData();
        long currentTimeMillis = System.currentTimeMillis();
        
		try {
			int theatreId;
	    	JSONObject addressObject=payloadData.getJSONObject("address");
	    	addressObject.put("created_time", currentTimeMillis);
	    	addressObject.put("modified_time", currentTimeMillis);
	    	addressObject.put("city",City.fromString(addressObject.getString("city").toLowerCase()).getValue());
			Address address=JsonConverter.jsonObjectToClassObject(addressObject, Address.class);
			if(address.getDoorNo()==null || address.getStreetAddress()==null || address.getCity()==0 || address.getPincode()==0)
			{
		    	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Please fill all required fields");
				return response;

			}
	        int addressId = 0;

	        try {
		           addressId=QueryExecutor.executeInsert(TableNames.ADDRESS, address,"address_id");
		            
		        } catch (Exception e) {

		        	logger.error(e);
			    	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Theatre adding unsuccessfull");
					return response;
		        }

			   try {
		        	payloadData.put("created_time", currentTimeMillis);
			    	payloadData.put("modified_time", currentTimeMillis);
		        	payloadData.put("address_id",addressId);
		        	
		            Theatre theatre=JsonConverter.jsonObjectToClassObject(payloadData, Theatre.class);
	
		            theatreId= QueryExecutor.executeInsert(TableNames.THEATRE, theatre,"theatre_id");
		            
		            }catch(Exception e){
			        	logger.error(e);
				    	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Theatre adding unsuccessfull");
						return response;
			   }
			   try {
				   QueryBuilder qb = new QueryBuilder();
     
		           qb.setTableName(TableNames.USER)
		             .setValue("type",2)
		             .setCondition(new Condition("user_id",Operator.EQUALS,Integer.parseInt((String) payloadData.get("manager_id"))));
		           
		           String query=qb.getUpdateQuery();
		           QueryExecutor.executeUpdate(query, qb.getValues());
		           qb.clear();
			       qb.setColumns()
			         .setJoin(new Join(JoinType.INNER, TableNames.THEATRE, TableNames.ADDRESS, "address_id", "address_id"))
			         .setCondition(new Condition("theatre_id",Operator.EQUALS,theatreId));
			       JSONArray newTheatre=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues());
		           
			       JSONObject response=CreateResponseJSONObject.createResponse(newTheatre, 200, true, "Theatre added Successfully!");
			       
			       return response;
				  
				   }catch(Exception e){
			        	logger.error(e);
						JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Theatre adding unsuccessfull");
						return response;
	    	   }

		} catch (Exception e) {
        	logger.error(e);
        	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Theatre adding unsuccessfull");
			return response;

		}
	}
	
	public static void updateTheatre(RestMetaData metaData) {
		JSONObject payloadData=metaData.getPayloadData();
        long currentTimeMillis = System.currentTimeMillis();
        
		try {
			
   		   	QueryBuilder qb = new QueryBuilder();
   		   	
   		   	qb.setTableName(TableNames.THEATRE)
   		   	  .setValue("manager_id",payloadData.get("manager_id"))
   		   	  .setValue("modified_time",currentTimeMillis)
   		   	  .setCondition(new Condition("theatre_id",Operator.EQUALS,metaData.getIdentifiers().get("theatres")));
   		   	String query=qb.getUpdateQuery();
   		   	QueryExecutor.executeUpdate(query, qb.getValues());
		}catch(Exception e)
		{
			logger.error("ERROR OCCURED IN UPDATETHEATRE THEATRESDAO "+e);
		}

	
	}
	
    public static long[] calculateDayStartAndEndFromMilli(long millis) {
        Instant instant = Instant.ofEpochMilli(millis);
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());

        LocalDate localDate = zonedDateTime.toLocalDate();

        ZonedDateTime startOfDay = localDate.atStartOfDay(ZoneId.systemDefault());
        long startMillis = startOfDay.toInstant().toEpochMilli();

        ZonedDateTime endOfDay = localDate.atTime(LocalTime.MAX).truncatedTo(ChronoUnit.MILLIS)
                .atZone(ZoneId.systemDefault());
        long endMillis = endOfDay.toInstant().toEpochMilli();

        return new long[]{startMillis, endMillis};
    }
}

