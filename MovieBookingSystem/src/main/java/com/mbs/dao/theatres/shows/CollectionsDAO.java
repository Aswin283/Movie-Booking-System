package com.mbs.dao.theatres.shows;

import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.utils.RestMetaData;
import com.mbs.utils.Constants.AggregateFunction;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class CollectionsDAO {
	public static JSONArray fetchCollections(RestMetaData metaData) {
		System.out.println("collections dao invoked successfully");

		int theatreId=metaData.getIdentifiers().get("theatres");
		int showId=metaData.getIdentifiers().get("shows");
		JSONObject result= new JSONObject();
	
		try {
			QueryBuilder qb=new QueryBuilder();
			qb.setTableName(TableNames.SEAT)
			  .setAggregateFunction(AggregateFunction.SUM, "price")
			  .setCondition(new Condition("show_id",Operator.EQUALS,showId))
			  .setCondition(new Condition("is_available",Operator.EQUALS,false));
			
			JSONObject ticketSumResult=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues()).getJSONObject(0);
			int ticketPriceSum=0;
			if(ticketSumResult.has("_sum"))
			{
				ticketPriceSum=ticketSumResult.getInt("_sum");
			}

			
			qb.clear();
			qb.setTableName(TableNames.BOOKING)
			  .setAggregateFunction(AggregateFunction.COUNT, "*")
			  .setCondition(new Condition("show_id",Operator.EQUALS,showId));
			
			JSONObject bookingsCountResult=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues()).getJSONObject(0);
			int totalBookingsCount=0;
			if(bookingsCountResult.has("_count"))
			{
				totalBookingsCount=bookingsCountResult.getInt("_count");
			}
		
			result.put("ticket_collection", ticketPriceSum);
			result.put("fee_collection", totalBookingsCount*30);
			result.put("tax_collection", ticketPriceSum*0.05);
			
			
			
			qb.clear();
			qb.setTableName(TableNames.SEAT)
			  .setAggregateFunction(AggregateFunction.COUNT, "*")
			  .setCondition(new Condition("show_id",Operator.EQUALS,showId))
			  .setCondition(new Condition("is_available",Operator.EQUALS,false));
			
			JSONObject totalTicketsSoldResult=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues()).getJSONObject(0);
			int totalTicketsSold=0;
			if(totalTicketsSoldResult.has("_count"))
			{
				totalTicketsSold=totalTicketsSoldResult.getInt("_count");
			}
			result.put("total_tickets_sold", totalTicketsSold);
			
			qb.clear();
			qb.setTableName(TableNames.THEATRE)
			  .setColumns("screen_rows","screen_columns")
			  .setCondition(new Condition("theatre_id",Operator.EQUALS,theatreId));
			
			JSONObject screenSizeResult=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues()).getJSONObject(0);
			System.out.println(screenSizeResult.toString());
			int screenSize=screenSizeResult.getInt("theatre_screen_rows")*screenSizeResult.getInt("theatre_screen_columns");
			result.put("total_tickets", screenSize);

			return new JSONArray().put(result);

		} catch (SQLException | JSONException e) {
			e.printStackTrace();
		}	
		return null;

	}

}
