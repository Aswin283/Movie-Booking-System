package com.mbs.utils;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

import org.json.JSONArray;

import com.mbs.utils.Constants.AggregateFunction;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class DateRange {
	public static JSONArray findDateRange() {
		try{
			QueryBuilder qb=new QueryBuilder();
			qb.setAggregateFunction(AggregateFunction.MAX, "timing")
			  .setAggregateFunction(AggregateFunction.MIN, "timing")
			  .setTableName(TableNames.SHOW)
			  .setCondition(new Condition("is_cancelled",Operator.EQUALS,false));
			String query=qb.getSelectQuery();
			JSONArray result=QueryExecutor.executeQuery(query, qb.getValues());
			System.out.println(result.toString());
			
		}catch(Exception e){
			System.out.println("Error");
			e.printStackTrace();
		}
		return null;
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
	  
	  public static long[] calculateDayStartAndEndFromDate(String dateStr) {
	        // Parse the input date string
	        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

	        // Get the start of the day (00:00:00)
	        LocalDateTime startOfDay = date.atStartOfDay();

	        // Get the end of the day (23:59:59.999)
	        LocalDateTime endOfDay = date.atTime(23, 59, 59, 999000000); // last nanosecond of the day

	        // Convert to milliseconds since epoch
	        long startMillis = startOfDay.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
	        long endMillis = endOfDay.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

	        return new long[]{startMillis, endMillis};
	    }
}
