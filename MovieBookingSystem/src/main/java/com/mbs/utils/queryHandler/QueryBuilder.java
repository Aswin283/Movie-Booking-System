package com.mbs.utils.queryHandler;

import java.lang.reflect.Field;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;

import com.mbs.utils.Constants.AggregateFunction;
import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.LogicalOperator;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;

public class QueryBuilder {
	 private List<String> columns;
	    private TableNames tableName;
	    private ArrayList<Condition> conditions;
	    private ArrayList<Join> joins;
	    private List<String> setClauses;
	    private String returningClause;
	    private List<Object> parameters;
	    private String command;
	    private String distinct;
	    private List<String> groupByClauses;
	    private List<String> orderByClauses;
	    private List<AggregateFunction> aggregateFunction;
	    private List<String> aggregateColumn;
	    private List<Object> values;
	    private List<List<Object>> batchValues;  // For handling multiple insertions


	    public QueryBuilder() {
	        this.columns = new ArrayList<>();
	        this.conditions = new ArrayList<>();
	        this.joins = new ArrayList<>();
	        this.setClauses = new ArrayList<>();
	        this.parameters = new ArrayList<>();
	        this.groupByClauses = new ArrayList<>();
	        this.orderByClauses = new ArrayList<>();
	        this.aggregateFunction=new ArrayList<>();
	        this.aggregateColumn=new ArrayList<>();
	        this.command = "";
	        this.values=new ArrayList<>();
	        this.batchValues = new ArrayList<>();

	    }

    public QueryBuilder setTableName(TableNames tableName) {
        this.tableName = tableName;
        return this;
    }

    public QueryBuilder setDistinct(String column)
    {
    	this.distinct=column;
    	return this;
    }
    public QueryBuilder setColumns(String... columns) {
        for (String column : columns) {
            this.columns.add(column);
        }
        return this;
    }

    public QueryBuilder setCondition(Condition condition) {
        this.conditions.add(condition);
        return this;
    }

    public QueryBuilder returning(String columnName) {
        this.returningClause = columnName;
        return this;
    }

    public QueryBuilder setValue(String columnName,Object value) {
        this.setClauses.add(columnName + " = ?");
        this.values.add(value);
        return this;
    }
   

    public QueryBuilder setJoin(Join join) {
        this.joins.add(join);
        return this;
    }
    
    public QueryBuilder setAggregateFunction(AggregateFunction function, String column) {
        this.aggregateFunction.add(function);
        this.aggregateColumn.add(column);
        return this;
    }

    // Add GROUP BY clauses
    public QueryBuilder addGroupBy(String... columns) {
        for (String column : columns) {
            this.groupByClauses.add(column);
        }
        return this;
    }

    // Add ORDER BY clauses
    public QueryBuilder addOrderBy(String... columns) {
        for (String column : columns) {
            this.orderByClauses.add(column);
        }
        return this;
    }

    public QueryBuilder addBatchValues(List<Object> valueSet) {
        this.batchValues.add(valueSet);
        return this;
    }
    public String getSelectQuery() {
        this.command = "SELECT";
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT ");
        
        if (distinct != null) {
            sb.append("DISTINCT ON (").append(this.distinct).append(") ");
        }

        if (!aggregateFunction.isEmpty() && !aggregateColumn.isEmpty()) {
            for (int i = 0; i < aggregateColumn.size(); i++) {
                sb.append(aggregateFunction.get(i).getFunction()).append("(").append(aggregateColumn.get(i)).append(")");
                if (i != aggregateColumn.size() - 1) {
                    sb.append(", ");
                }
            }
        } else {
            sb.append(columns.isEmpty() ? "*" : String.join(", ", columns));
        }

        sb.append(" FROM ");
        if(tableName!=null) {
        	sb.append(tableName.getTableName());
        }
        if (!joins.isEmpty()) {
            int joinCount = 0;
            for (Join join : joins) {
                if (joinCount == 0) {
                    sb.append(join.getPrimaryTableName().getTableName()).append(" ");
                }
                sb.append(" ").append(join.getJoinType().getType())
                  .append(" JOIN ").append(join.getSecondaryTableName().getTableName())
                  .append(" ON ").append(join.getPrimaryTableName().getTableName())
                  .append(".").append(join.getPrimaryKey())
                  .append(" = ").append(join.getSecondaryTableName().getTableName())
                  .append(".").append(join.getForeignKey());
                joinCount++;
            }
        }

        if (!conditions.isEmpty()) {
            sb.append(" WHERE ");
            for (int i = 0; i < conditions.size(); i++) {
                Condition condition = conditions.get(i);

                if (!condition.getTableName().isEmpty()) {
                    sb.append(condition.getTableName()).append(".");
                }
                sb.append(condition.getColumnName()).append(" ").append(condition.getOperator()).append(" ");

                // Handle IN operator
                if (condition.getOperator().equalsIgnoreCase("IN") && condition.getValue() instanceof JSONArray) {
                    JSONArray array = (JSONArray) condition.getValue();
                    sb.append("(");
                    for (int j = 0; j < array.length(); j++) {
                        sb.append("?");
                        if (j < array.length() - 1) {
                            sb.append(", ");
                        }
                        try {
							this.values.add(array.get(j));
						} catch (JSONException e) {
							e.printStackTrace();
						} 
                    }
                    sb.append(")");
                } else {
                    sb.append("?");
                    this.values.add(condition.getValue());
                }

                if (i < conditions.size() - 1) {
                    sb.append(" ").append("AND").append(" ");
                }
            }
        }

        if (!groupByClauses.isEmpty()) {
            sb.append(" GROUP BY ").append(String.join(", ", groupByClauses));
        }

        if (!orderByClauses.isEmpty()) {
            sb.append(" ORDER BY ").append(String.join(", ", orderByClauses));
        }

        if (returningClause != null) {
            sb.append(" RETURNING ").append(returningClause);
        }

        return sb.toString();
    }

    public String getInsertQuery() {
        this.command = "INSERT";
        StringBuilder sb = new StringBuilder();
        sb.append("INSERT INTO ").append(tableName.getTableName()).append(" (");
        sb.append(String.join(", ", columns));
        sb.append(") VALUES ");

        if (!batchValues.isEmpty()) {
            for (int i = 0; i < batchValues.size(); i++) {
                sb.append("(").append("?".repeat(columns.size()).replaceAll(".", "?,")).setLength(sb.length() - 1);
                sb.append(")");
                if (i < batchValues.size() - 1) {
                    sb.append(", ");
                }
            }
        } else {
            sb.append("(");
            sb.append("?".repeat(columns.size()).replaceAll(".", "?,"));
            sb.setLength(sb.length() - 1); // Remove the last comma
            sb.append(")");
        }

        if (returningClause != null) {
            sb.append(" RETURNING ").append(returningClause);
        }

        return sb.toString();
    }

    public String getUpdateQuery() {
        this.command = "UPDATE";
        StringBuilder sb = new StringBuilder();
        sb.append("UPDATE ").append(tableName.getTableName()).append(" SET ");
        sb.append(String.join(", ", setClauses));
  
        if (!conditions.isEmpty()) {
            sb.append(" WHERE ");
            for (int i = 0; i < conditions.size(); i++) {
                Condition condition = conditions.get(i);
                this.values.add(condition.getValue());

                if(!condition.getTableName().equals(""))
                {
                    sb.append(condition.getTableName()).append(".").append(condition.getColumnName())
                    .append(" ").append(condition.getOperator()).append(" ?");                	
                }
                else {
                	sb.append(condition.getColumnName())
                    .append(" ").append(condition.getOperator()).append(" ?");	
                }
                
                
                if (i < conditions.size() - 1) {
                    sb.append(" ").append(condition.getLogicalOperator()).append(" "); // Add AND/OR between conditions
                }
            }
        }

        if (returningClause != null) {
            sb.append(" RETURNING ").append(returningClause);
        }

        return sb.toString();
    }

    public String getDeleteQuery() {
        this.command = "DELETE";
        StringBuilder sb = new StringBuilder();
        sb.append("DELETE FROM ").append(tableName.getTableName());

        if (!conditions.isEmpty()) {
            sb.append(" WHERE ");
            for (int i = 0; i < conditions.size(); i++) {
                Condition condition = conditions.get(i);
                sb.append(condition.getTableName()).append(".").append(condition.getColumnName())
                  .append(" ").append(condition.getOperator()).append(" ?");

                if (i < conditions.size() - 1) {
                    sb.append(" ").append(condition.getLogicalOperator());
                }
            }
        }

        if (returningClause != null) {
            sb.append(" RETURNING ").append(returningClause);
        }

        return sb.toString();
    }


    public PreparedStatement selectPrepareStatement(PreparedStatement ps, List<Object> values) {
        int i = 1;
        for (Object value : values) {
            try {
                ps.setObject(i, value);
                i++;
            } catch (SQLException e) {
                System.out.println("Error occurred at prepareStatement: " + e);
                e.printStackTrace();
            }
        }
        return ps;
    }
    public PreparedStatement prepareStatement(PreparedStatement ps, Object obj) {
    		System.out.println(obj.getClass().getSimpleName());
        Class<?> objClass = obj.getClass();
        Field[] fields = objClass.getDeclaredFields(); 

        int index = 1; 

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object value = field.get(obj);

                if(value!=null)	
                	{
                		ps.setObject(index, value);
                		index++;
                	}
                
            } catch (IllegalAccessException e) {
                System.out.println("Error occurred while accessing field: " + e);
                e.printStackTrace();
            } catch (SQLException e) {
                System.out.println("Objects no need to be inserted");
            }
        }
        return ps;
    }
    public List<Object> getValues(){
    	return values;
    }
    public List<List<Object>> getBatchValues(){
    	return batchValues;
    }
    public void clear() {
        this.columns.clear();
        this.conditions.clear();
        this.joins.clear();
        this.setClauses.clear();
        this.parameters.clear();
        this.groupByClauses.clear();
        this.orderByClauses.clear();
        this.returningClause = null;
        this.command = "";
        this.aggregateFunction = new ArrayList<>();
        this.aggregateColumn = new ArrayList<>();
        this.values.clear();
        this.tableName = null;
    }

    
    public static void main(String [] ar)
    {
    	JSONArray seatIds = new JSONArray();

        for (int i = 1; i <= 5; i++) {
            seatIds.put(i);
        }

		QueryBuilder qb=new QueryBuilder();
		qb.setTableName(TableNames.BOOKING)
		  .setAggregateFunction(AggregateFunction.COUNT, "*")
		  .setCondition(new Condition("is_available",Operator.IN,seatIds));
		  
    	String query=qb.getSelectQuery();
    	System.out.println(query);


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
  
}