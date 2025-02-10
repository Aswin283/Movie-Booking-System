package com.mbs.dao.movies.shows;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;

import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.LogicalOperator;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.handlers.AuthenticationHandler;
import com.mbs.utils.RestMetaData;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class SeatsDAO {

    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);

	public static JSONArray fetchSeats(RestMetaData metaData) {

	    try{
			
	    	QueryBuilder qb=new QueryBuilder();
			qb.setTableName(TableNames.SHOW)
			  .setColumns("theatre_id")
			  .setCondition(new Condition("show_id",Operator.EQUALS,metaData.getIdentifiers().get("shows")));
			int theatreId=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues()).getJSONObject(0).getInt("show_theatre_id");
	    	System.out.println("theatre_id: "+theatreId);
	    	
	    	qb.clear();
			qb.setColumns()
			  .setJoin(new Join(JoinType.INNER,TableNames.SEAT,TableNames.SHOW,"show_id","show_id"))
			  .setJoin(new Join(JoinType.INNER,TableNames.SHOW,TableNames.THEATRE,"theatre_id","theatre_id"))
			  .setCondition(new Condition(TableNames.SHOW,"show_id",Operator.EQUALS,LogicalOperator.AND,metaData.getIdentifiers().get("shows")))
			  .setCondition(new Condition(TableNames.THEATRE,"theatre_id",Operator.EQUALS,theatreId))
			  .addOrderBy("seat_id");
			
			String query=qb.getSelectQuery();
			JSONArray result=QueryExecutor.executeQuery(query, qb.getValues());

			return result;
			
	    }catch(Exception e)
	    {
	    	logger.error("Error Occured in fetchSeats DAO "+e);
	    }
	    return null;
		
	}
	
}
