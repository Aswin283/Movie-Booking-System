package com.mbs.dao.theatres.shows;

import org.json.JSONArray;

import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.LogicalOperator;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.RestMetaData;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class SeatsDAO {

	
	public static JSONArray fetchSeats(RestMetaData metaData) {

	    try{
			
	    	QueryBuilder qb=new QueryBuilder();
			
			qb.setColumns()
			  .setJoin(new Join(JoinType.INNER,TableNames.SEAT,TableNames.SHOW,"show_id","show_id"))
			  .setJoin(new Join(JoinType.INNER,TableNames.SHOW,TableNames.THEATRE,"theatre_id","theatre_id"))
			  .setCondition(new Condition(TableNames.SHOW,"show_id",Operator.EQUALS,LogicalOperator.AND,metaData.getIdentifiers().get("shows")))
			  .setCondition(new Condition(TableNames.THEATRE,"theatre_id",Operator.EQUALS,metaData.getIdentifiers().get("theatres")))
			  .addOrderBy("seat_id");
			
			String query=qb.getSelectQuery();
			JSONArray result=QueryExecutor.executeQuery(query, qb.getValues());

			return result;
			
	    }catch(Exception e)
	    {
	    	System.out.println("Error Occured in fetchSeats DAO "+e);
	    	e.printStackTrace();
	    }
	    return null;
		
	}
	
}
