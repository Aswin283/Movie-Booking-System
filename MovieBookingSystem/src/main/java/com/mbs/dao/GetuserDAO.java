package com.mbs.dao;

import java.sql.SQLException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;

import com.mbs.handlers.AuthenticationHandler;
import com.mbs.utils.RestMetaData;
import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class GetuserDAO {

    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);
	public static JSONArray fetchUsers(RestMetaData metaData) {

        QueryBuilder qb = new QueryBuilder();
        JSONArray result=null;

        qb.setColumns()
          .setJoin(new Join(JoinType.INNER,TableNames.USER,TableNames.ADDRESS,"address_id","address_id"))
          .setCondition(new Condition(TableNames.USER,"type",Operator.EQUALS,1));
        try {
			result=QueryExecutor.executeQuery(qb.getSelectQuery(),qb.getValues());
			
		} catch (Exception e)
        {		
			logger.error(e);
        }
        return result;
	}
}
