package com.mbs.dao;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;

import com.mbs.handlers.AuthenticationHandler;
import com.mbs.utils.PasswordUtil;
import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class AuthenticationDAO {
    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);
	
	
	public static JSONArray getUserByPno(long pno)
	{
	    try{
	        QueryBuilder qb = new QueryBuilder();

        	qb.setColumns()
        	  .setJoin(new Join(JoinType.INNER,TableNames.USER,TableNames.ADDRESS,"address_id","address_id"))
        	  .setCondition(new Condition(TableNames.USER,"pno",Operator.EQUALS,pno));
            String query=qb.getSelectQuery();           
	    	JSONArray userDetails=QueryExecutor.executeQuery(query, qb.getValues());
	    	
	    	return userDetails;
	    }catch(Exception e){
	    	logger.error("Error occured in checkUserByPno due to "+e);
	    	return null;
	    }
	}
	
	public static JSONArray authenticateUser(long pno,String password)
	{
		try {
	    	JSONArray userDetails=getUserByPno(pno);
	    	if(userDetails!=null) {
		    	String hashedPassword=userDetails.getJSONObject(0).getString("USER_password");
		    	if(PasswordUtil.checkPassword(password, hashedPassword)){
		    		return userDetails;
		    	}
	    		
	    	}
	    }catch(Exception e){
	    	logger.error("Error occured in authenticateUser "+e);
	    }
    	return null;

	}
}
