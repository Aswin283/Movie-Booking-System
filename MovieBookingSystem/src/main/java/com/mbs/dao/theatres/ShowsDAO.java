package com.mbs.dao.theatres;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.LogicalOperator;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.JsonConverter;
import com.mbs.utils.RestMetaData;
import com.mbs.handlers.AuthenticationHandler;
import com.mbs.models.Show;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class ShowsDAO {
    private static final Logger logger=LogManager.getLogger(AuthenticationHandler.class);
	public static boolean checkShowPossibility(long newShowTiming, long newMovieDuration, ArrayList<Long> showTimings,
			ArrayList<Long> showDurations) {
		long breakTime = 15 * 60 * 1000; 

		long newShowEndTime = newShowTiming + (newMovieDuration * 60 * 1000); 

		for (int i = 0; i < showTimings.size(); i++) {
			long existingShowTiming = showTimings.get(i);
			long existingShowEndTime = existingShowTiming + (showDurations.get(i) * 60 * 1000) + breakTime; 

			if ((newShowTiming >= existingShowTiming && newShowTiming <= existingShowEndTime)
					|| (newShowEndTime >= existingShowTiming && newShowEndTime <= existingShowEndTime)) {
				return false;
			}

			if (existingShowTiming >= newShowTiming && existingShowTiming <= newShowEndTime) {
				return false;
			}
		}

		return true; 
	}

	public static JSONObject deleteShow(RestMetaData metaData) {
		System.out.println("DELETE SHOW INVOKED");
		long currentTime = System.currentTimeMillis();
		int showId = metaData.getIdentifiers().get("shows");
		int theatreId = metaData.getIdentifiers().get("theatres");
		try {

			// updating show table first setting isCa=true
			QueryBuilder qb = new QueryBuilder();
			qb.setTableName(TableNames.SHOW).setValue("is_cancelled", true).setValue("modified_time", currentTime)
			  .setCondition(new Condition("show_id", Operator.EQUALS, showId))
			  .returning("show_id");		
			int deletedShowId=QueryExecutor.executeUpdate(qb.getUpdateQuery(), qb.getValues());
			JSONArray deletedId= new JSONArray();
			deletedId.put( deletedShowId);
			logger.info("Show Deleted Successfully");
			JSONObject result=CreateResponseJSONObject.createResponse(deletedId, 200, true, "Show Deleted Successfully");

			qb.clear();
			
			// updating booking table first setting isCa=true

			qb.setTableName(TableNames.BOOKING).setValue("is_cancelled", true).setValue("modified_time", currentTime)
					.setCondition(new Condition("show_id", Operator.EQUALS, showId));
			QueryExecutor.executeUpdate(qb.getUpdateQuery(), qb.getValues());

			return result;

		} catch (Exception e) {
			logger.error( "Show Deletion Unsuccessfull");
			JSONObject result=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Show Deletion Unsuccessfull");
			return result;
		}
	}

	public static JSONObject createShow(RestMetaData metaData) {
		try {			QueryBuilder qb = new QueryBuilder();

			JSONObject payloadData = metaData.getPayloadData();
			long currentTime = System.currentTimeMillis();
			System.out.println("CURRENTTIME: " + currentTime);
			long showTiming = payloadData.getLong("timing");
			long[] dayStartAndEnd = calculateDayStartAndEndFromMilli(showTiming);
			long dayStart = dayStartAndEnd[0];
			long dayEnd = dayStartAndEnd[1];
			HashMap<String, Integer> identifiers = metaData.getIdentifiers();

			int theatreId = identifiers.get("theatres");
			int userId = payloadData.getInt("user_id");
			qb.setTableName(TableNames.THEATRE).setColumns("theatre_id", "manager_id")
					.setCondition(new Condition("theatre_id", Operator.EQUALS, theatreId));
			JSONArray idCheck = QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues());

			int theatreIdCheck = idCheck.getJSONObject(0).getInt("theatre_theatre_id");

			int userIdCheck = idCheck.getJSONObject(0).getInt("theatre_manager_id");
			if (theatreIdCheck != theatreId || userIdCheck != userId) {
				JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Facility Unavailable!");
				return response;
			}

			qb.clear();
			System.out.println("START" + dayStart + " " + dayEnd);
			qb.setColumns("timing", "duration")
					.setJoin(new Join(JoinType.INNER, TableNames.SHOW, TableNames.MOVIE, "movie_id", "movie_id"))
					.setCondition(new Condition(TableNames.SHOW, "theatre_id", Operator.EQUALS, LogicalOperator.AND,
							identifiers.get("theatres")))
					.setCondition(new Condition(TableNames.SHOW, "timing", Operator.GREATER_THAN_OR_EQUAL,
							LogicalOperator.AND, dayStart))
					.setCondition(new Condition(TableNames.SHOW, "timing", Operator.LESS_THAN_OR_EQUAL, dayEnd))
					.setCondition(new Condition(TableNames.SHOW, "is_cancelled", Operator.EQUALS, false));

			String query = qb.getSelectQuery();
			JSONArray shows = QueryExecutor.executeQuery(query, qb.getValues());

			
			// Checking number of shows in the theatre
			if (shows.length() == 3) {
				JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Shows limit reached (3)");
				return response;
			}
			if (shows.length() != 0) {
				ArrayList<Long> showTimings = new ArrayList<>();
				ArrayList<Long> showDurations = new ArrayList<>();
				for (int i = 0; i < shows.length(); i++) {
					JSONObject showDetails = shows.getJSONObject(i);
					showTimings.add(showDetails.getLong("show_timing"));
					showDurations.add(showDetails.getLong("movie_duration"));
				}

				qb.clear();// 1729321200000 1729355406479

				if (payloadData.getLong("timing") < currentTime + (15 * 60 * 1000)) {
					JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Show timing should be atleast 15mins ahead");
					return response;
				}

				payloadData.put("created_time", currentTime);
				payloadData.put("modified_time", currentTime);

				Show show = JsonConverter.jsonObjectToClassObject(payloadData, Show.class);

				if(show.getTiming()==0 || show.getTheatreId()==0 || show.getMovieId()==0 )
				{
			    	JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Please fill all required fields");
					return response;
				}
				
				qb.setTableName(TableNames.MOVIE).setColumns("duration").setCondition(new Condition("movie_id",
						Operator.EQUALS, Integer.parseInt((String) payloadData.get("movie_id"))));

				query = qb.getSelectQuery();
				long movieDuration = QueryExecutor.executeQuery(query, qb.getValues()).getJSONObject(0)
						.getLong("movie_duration");

				boolean isPossible = checkShowPossibility(show.getTiming(), movieDuration, showTimings, showDurations);

				if (isPossible) {
					qb.clear();

					// Insert show and retrieve show ID
					int showId = insertShow(show);

					// Insert seats for the show
					insertSeatsForShow(showId, identifiers.get("theatres"), payloadData.getInt("price"), currentTime);

					qb.clear();
					qb.setJoin(new Join(JoinType.INNER,TableNames.SHOW,TableNames.MOVIE,"movie_id","movie_id"))
					  .setJoin(new Join(JoinType.INNER,TableNames.SHOW,TableNames.THEATRE,"theatre_id","theatre_id"))
					  .setCondition(new Condition(TableNames.SHOW,"show_id",Operator.EQUALS,showId));
					
					JSONArray newShow=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues());
					System.out.println("NEW SHOW: "+newShow.toString()); 
					JSONObject response=CreateResponseJSONObject.createResponse(newShow, 200, true, "Show scheduled successfully!");
					
					return response;
				} else {
					JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Show timing coincides");
					return response;
				}
			} else {
				// No shows exist, insert the new show
				int showId = insertShow(JsonConverter.jsonObjectToClassObject(payloadData, Show.class));

				// Insert seats for the show
				insertSeatsForShow(showId, identifiers.get("theatres"), payloadData.getInt("price"), currentTime);
				qb.clear();
				qb.setJoin(new Join(JoinType.INNER,TableNames.SHOW,TableNames.MOVIE,"movie_id","movie_id"))
				  .setJoin(new Join(JoinType.INNER,TableNames.SHOW,TableNames.THEATRE,"theatre_id","theatre_id"))
				  .setCondition(new Condition(TableNames.SHOW,"show_id",Operator.EQUALS,showId));
				
				JSONArray newShow=QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues());
				System.out.println("NEW SHOW: "+newShow.toString()); 
				JSONObject response=CreateResponseJSONObject.createResponse(newShow, 200, true, "Show scheduled successfully!");
				return response;
				
			}
		} catch (Exception e) {
			JSONObject response=CreateResponseJSONObject.createResponse(new JSONArray(), 409, false, "Show adding failed");
			return response;
		}
	}

	public static JSONArray fetchShow(RestMetaData metaData) {
		try {
			QueryBuilder qb = new QueryBuilder();
			String date = metaData.getFilters().get("date");

			long[] dayStartAndEnd = calculateDayStartAndEndFromDate(date);
			long dayStart = dayStartAndEnd[0];
			long dayEnd = dayStartAndEnd[1];

			qb.setColumns()
					.setJoin(new Join(JoinType.INNER, TableNames.SHOW, TableNames.MOVIE, "movie_id", "movie_id"));
			if (metaData.getIdentifiers() != null && metaData.getIdentifiers().get("shows") != null) {
				qb.setCondition(new Condition(TableNames.SHOW, "show_id", Operator.EQUALS, LogicalOperator.AND,
						metaData.getIdentifiers().get("shows")));
			}
			if (metaData.getFilters() != null) {
				if (metaData.getFilters().get("movie") != null) {
					qb.setCondition(new Condition(TableNames.MOVIE, "movie_name", Operator.EQUALS, LogicalOperator.AND,
							metaData.getFilters().get("movie")));
				}
				if (metaData.getFilters().get("isCancelled") == null) {
					qb.setCondition(new Condition(TableNames.SHOW, "is_cancelled", Operator.EQUALS, LogicalOperator.AND,
							false));
				}
			}
			qb.setCondition(new Condition(TableNames.SHOW, "theatre_id", Operator.EQUALS, LogicalOperator.AND,
					metaData.getIdentifiers().get("theatres")));
			qb.setCondition(new Condition(TableNames.SHOW, "timing", Operator.GREATER_THAN_OR_EQUAL,
					LogicalOperator.AND, dayStart))
					.setCondition(new Condition(TableNames.SHOW, "timing", Operator.LESS_THAN_OR_EQUAL,
							LogicalOperator.AND, dayEnd))
					.setCondition(new Condition(TableNames.SHOW, "is_cancelled", Operator.EQUALS, LogicalOperator.AND,
							false));
			qb.addOrderBy("SHOW.timing");

			String query = qb.getSelectQuery();
			return QueryExecutor.executeQuery(query, qb.getValues());

		} catch (Exception e) {
			System.out.println("Error occurred in fetchShow");
			e.printStackTrace();
		}
		return null;
	}

	private static ArrayList<String> generateScreenSeatNumbers(int screenRows, int screenColumns) {
		ArrayList<String> seatNumbers = new ArrayList<>();
		for (int row = 0; row < screenRows; row++) {
			String rowLabel = generateRowLabel(row);
			for (int col = 1; col <= screenColumns; col++) {
				String seatNumber = rowLabel + col;
				seatNumbers.add(seatNumber);
			}
		}
		return seatNumbers;
	}

	private static String generateRowLabel(int row) {
		return Character.toString((char) ('A' + row));
	}

	private static long[] calculateDayStartAndEndFromMilli(long millis) {
		Instant instant = Instant.ofEpochMilli(millis);
		ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());

		LocalDate localDate = zonedDateTime.toLocalDate();

		ZonedDateTime startOfDay = localDate.atStartOfDay(ZoneId.systemDefault());
		ZonedDateTime endOfDay = localDate.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault());
		System.out.println(new long[] { startOfDay.toInstant().toEpochMilli(), endOfDay.toInstant().toEpochMilli() });

		return new long[] { startOfDay.toInstant().toEpochMilli(), endOfDay.toInstant().toEpochMilli() };
	}

	private static long[] calculateDayStartAndEndFromDate(String dateString) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse(dateString, formatter);

		ZonedDateTime startOfDay = date.atStartOfDay(ZoneId.systemDefault());
		ZonedDateTime endOfDay = date.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault());

		return new long[] { startOfDay.toInstant().toEpochMilli(), endOfDay.toInstant().toEpochMilli() };
	}

	private static int insertShow(Show show) throws Exception {

		return QueryExecutor.executeInsert(TableNames.SHOW, show,"show_id");

	}

	private static void insertSeatsForShow(int showId, int theatreId, int price, long currentTime) throws Exception {
		QueryBuilder qb = new QueryBuilder();

		qb.setColumns("screen_rows", "screen_columns").setTableName(TableNames.THEATRE)
		  .setCondition(new Condition("theatre_id", Operator.EQUALS, theatreId));

		String query = qb.getSelectQuery();
		JSONArray screenSize = QueryExecutor.executeQuery(query, qb.getValues());

		int screenRows = screenSize.getJSONObject(0).getInt("theatre_screen_rows");
		int screenColumns = screenSize.getJSONObject(0).getInt("theatre_screen_columns");

		ArrayList<String> seatNumbers = generateScreenSeatNumbers(screenRows, screenColumns);

		qb.clear();
		qb.setTableName(TableNames.SEAT).setColumns("show_id", "number", "price", "is_available", "created_time","modified_time");

		for (String seatNumber : seatNumbers) {
			qb.addBatchValues(Arrays.asList(showId, seatNumber, price, true, currentTime, currentTime));
		}
		String insertQuery = qb.getInsertQuery();
		QueryExecutor.executeBatchInsert(insertQuery, qb.getBatchValues());
	}

	public static void main(String[] arg) {
		long time = 1729697640000l;
		System.out.println(calculateDayStartAndEndFromMilli(1729697640000l));
	}

}
