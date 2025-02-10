package com.mbs.utils.queryHandler;

import java.lang.reflect.Field;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;

import com.google.gson.annotations.SerializedName;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.JsonConverter;

public class QueryExecutor {

    public static Connection createConnection() {
        try {
            Class.forName("org.postgresql.Driver");
            String url = "jdbc:postgresql://localhost:5432/aswin-pt7698";
            String dbUsername = "aswin-pt7698";
            String dbPassword = "";

            return DriverManager.getConnection(url, dbUsername, dbPassword);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static int executeInsert(TableNames tableName, Object obj) throws Exception {
    	
    	return executeInsert(tableName,obj,null);
    	
    }    
    
    
    
    
    public static int executeInsert(TableNames tableName, Object obj,String returnId) throws Exception {
        Connection connection = createConnection();
        PreparedStatement ps = null;

        try {

        	Class<?> clazz = obj.getClass();
            Field[] fields = clazz.getDeclaredFields();

            List<String> columns = new ArrayList<>();
            List<Object> values = new ArrayList<>();

            for (Field field : fields) {
                SerializedName annotation = field.getAnnotation(SerializedName.class);
                if (annotation != null) {
                    columns.add(annotation.value());
                    field.setAccessible(true);
                    values.add(field.get(obj));
                }
            }

            QueryBuilder qb = new QueryBuilder();
            qb.setTableName(tableName)
              .setColumns(columns.toArray(new String[0]));
            if(returnId!=null)
            {
            	qb.returning(returnId);
            }

            String query = qb.getInsertQuery();

            ps = prepareStatement(connection, query, obj);
            System.out.println("Returning: "+ps);
            boolean hasResultSet = ps.execute();

            if (hasResultSet) {
                try (ResultSet generatedKeys = ps.getResultSet()) {
                    if (generatedKeys.next()) {
                        int id = generatedKeys.getInt(1);
                        return id;
                    }
                }
            }
        } finally {
            if (connection != null && !connection.isClosed()) {
            	connection.close();
            }
        }

        return 0;
    }

    public static int executeInsert(String query,ArrayList<Object> params) throws SQLException {
        Connection connection = createConnection();
    	PreparedStatement ps=selectPrepareStatement(connection,query,params);

        boolean hasResultSet = ps.execute();
        if (hasResultSet) {
            try (ResultSet generatedKeys = ps.getResultSet()) {
                if (generatedKeys.next()) {
                	int id=generatedKeys.getInt(1);
                	System.out.println("id generated is = "+id);
                    return id;
                }
            }catch(Exception e){
            	System.out.println("Error Occured in excuteInsert "+e);
            }finally {
                if (connection != null && !connection.isClosed()) {
                	connection.close();
                }
            }
        }
        return 0;
    }
    
    public static JSONArray executeQuery(String query, List<Object> values) throws SQLException, JSONException {
        Connection connection = createConnection();

        try (PreparedStatement ps = selectPrepareStatement(connection, query, values)) {
        	System.out.println("AFTER PREPARING: \n"+ps);
            try (ResultSet resultSet = ps.executeQuery()) {
                return JsonConverter.resultSetToJson(resultSet);
            }
        } finally {
            if (connection != null && !connection.isClosed()) {
            	connection.close();
            }
        }
    }

    public static boolean executeBatchInsert(String query, List<List<Object>> batchValues) throws SQLException {
        Connection connection = createConnection();

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            int index = 1;
        	for (List<Object> values : batchValues) {
                for (Object value : values) {
                    ps.setObject(index++, value);
                }
                ps.addBatch();
            }
            ps.execute();
            return true;
        } finally {
            if (connection != null && !connection.isClosed()) {
            	connection.close();
            }
        }
    }

    public static int executeUpdate(String query, List<Object> values) throws SQLException {
        Connection connection = createConnection();

        try (PreparedStatement ps = selectPrepareStatement(connection, query, values)) {
            boolean hasResultSet = ps.execute();

            if (hasResultSet) {
                try (ResultSet rs = ps.getResultSet()) {
                    if (rs.next()) {
                        return rs.getInt(1);
                    }
                }
            } else {
                return ps.executeUpdate();
            }
        } finally {
            if (connection != null && !connection.isClosed()) {
            	connection.close();
            }
        }

        return 0;
    }

    private static PreparedStatement selectPrepareStatement(Connection connection, String query, List<Object> values)
            throws SQLException {
        PreparedStatement ps = connection.prepareStatement(query);

        for (int i = 0; i < values.size(); i++) {
            ps.setObject(i + 1, values.get(i));
        }

        return ps;
    }

    private static PreparedStatement prepareStatement(Connection connection, String query, Object obj) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(query);

        try {
            Field[] fields = obj.getClass().getDeclaredFields();
            int index = 1;

            for (Field field : fields) {
                SerializedName annotation = field.getAnnotation(SerializedName.class);
                if(annotation!=null)
                {
                    field.setAccessible(true);
                    Object value = field.get(obj);
                    ps.setObject(index++, value != null ? value : "");                	
                }
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        return ps;
    }
}
