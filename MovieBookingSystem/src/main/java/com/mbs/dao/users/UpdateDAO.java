package com.mbs.dao.users;

import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.utils.Constants.City;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.EncryptionDecryption;
import com.mbs.utils.PasswordUtil;
import com.mbs.utils.RestMetaData;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class UpdateDAO {
	  public static boolean isValidPhoneNumber(long phoneNumber) {
	        String phoneNumberStr = String.valueOf(phoneNumber);
	        String phoneRegex = "^[0-9]{10}$";
	        return phoneNumberStr.matches(phoneRegex);
	    }
    public static JSONObject updateProfile(RestMetaData metaData) {
    	
    	QueryBuilder qb=new QueryBuilder();
    	
    	long currentTime=System.currentTimeMillis();
    	
    	try {
    		System.out.println(metaData.getPayloadData().toString());
			String firstName=metaData.getPayloadData().getString("first_name");
			String lastName=metaData.getPayloadData().getString("last_name");
			String password ="";
			String confirmPassword="";
			int city=metaData.getPayloadData().getInt("city");
			long pno=metaData.getPayloadData().getLong("pno");
			boolean passwordChange=false;
			if(metaData.getPayloadData().has("updatePassword"))
			{
				passwordChange=true;
			}
			if(passwordChange)
			{
				password=metaData.getPayloadData().getString("updatedPassword");
				confirmPassword=metaData.getPayloadData().getString("updatedConfirmPassword");				
			}
			
			
			qb.setTableName(TableNames.USER)
			  .setColumns("user_id")
			  .setCondition(new Condition("pno",Operator.EQUALS,pno));
			
			JSONObject pnoCheck = QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues()).getJSONObject(0);
			System.out.println("PNO CHECK: "+pnoCheck.toString());
			if (pnoCheck.getInt("USER_user_id")!=metaData.getIdentifiers().get("users"))
			{
				JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Phone Number already exists");
				return result;
			}
			
			
			if(!isValidPhoneNumber(pno))
			{
				JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Invalid Phone Number");
				return result;
			}
			if(passwordChange && !password.equals(confirmPassword))
			{
				JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Passwords does not match");
				return result;
			}
			qb.clear();
			qb.setValue("first_name", firstName)
			  .setValue("last_name",lastName)
			  .setValue("pno",pno)
			  .setValue("modified_time", currentTime)
			  .setTableName(TableNames.USER)
			  .setCondition(new Condition("user_id",Operator.EQUALS,metaData.getIdentifiers().get("users")))
			  .returning("address_id");
			
			if(passwordChange)
			{
				qb.setValue("password", PasswordUtil.hashPassword(password));
			}
			int addressId=QueryExecutor.executeUpdate(qb.getUpdateQuery(),qb.getValues());
			
			qb.clear();
						
			qb.setValue("city", city)
			  .setValue("modified_time", currentTime)
			  .setTableName(TableNames.ADDRESS)
			  .setCondition(new Condition("address_id",Operator.EQUALS,addressId));
			
		
			QueryExecutor.executeUpdate(qb.getUpdateQuery(),qb.getValues());
			JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 200, true, "Profile Updated Successfully!");
			return result;
			
    	} catch (Exception e) {
    		System.out.println(e);
    		e.printStackTrace();
    		System.out.println(metaData.getPayloadData().toString());
    		JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Profile Updation Failed");
			return result;		}
    	
    }

}
