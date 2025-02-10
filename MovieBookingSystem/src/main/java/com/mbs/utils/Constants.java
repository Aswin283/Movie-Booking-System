package com.mbs.utils;

public class Constants {
	
	 public enum TableNames {
	        USER("\"USER\""),
	        THEATRE("THEATRE"),
	        ADDRESS("ADDRESS"),
	        BOOKING("BOOKING"),
	        SHOW("SHOW"),
	        MOVIE("MOVIE"),
	        BOOKING_SEAT_MAPPING("BOOKINGSEATMAPPING"),
	        SEAT("SEAT"),
	        NULL("");
	        private final String tableName;

	        TableNames(String tableName) {
	            this.tableName = tableName;
	        }

	        public String getTableName() {
	            return tableName;
	        }

	        public static TableNames fromString(String tableName) {
	            for (TableNames table : TableNames.values()) {
	                if (table.getTableName().equalsIgnoreCase(tableName)) {
	                    return table;
	                }
	            }
	            throw new IllegalArgumentException("Unknown table name: " + tableName);
	        }
	    }
	public enum AggregateFunction {
	    COUNT("COUNT"),
	    SUM("SUM"),
	    AVG("AVG"),
	    MAX("MAX"),
	    MIN("MIN");

	    private final String function;

	    AggregateFunction(String function) {
	        this.function = function;
	    }
	  
	    public String getFunction() {
	        return function;
	    }
	}

	public enum Operator {
        EQUALS("="),
        NOT_EQUALS("!="),
        GREATER_THAN(">"),
        LESS_THAN("<"),
        GREATER_THAN_OR_EQUAL(">="),
        LESS_THAN_OR_EQUAL("<="),
        LIKE("LIKE"),
        IN("IN"),
        NULL("");

        private final String symbol;

        Operator(String symbol) {
            this.symbol = symbol;
        }

        public String getSymbol() {
            return symbol;
        }

        public static Operator fromString(String symbol) {
            for (Operator operator : Operator.values()) {
                if (operator.getSymbol().equalsIgnoreCase(symbol)) {
                    return operator;
                }
            }
            throw new IllegalArgumentException("Unknown operator: " + symbol);
        }
    } 
	public enum HttpMethod {
	    GET("fetch", "GET"),
	    POST("create", "POST"),
	    PUT("update", "PUT"),
	    DELETE("delete", "DELETE");

	    private final String action; // action associated with the method, like fetch, create
	    private final String method; // HTTP method (GET, POST, PUT, DELETE)

	    // Enum constructor
	    HttpMethod(String action) {
	        this.action = action;
	        this.method = null;
	    }

	    HttpMethod(String action, String method) {
	        this.action = action;
	        this.method = method;
	    }

	    // Getter for HTTP method
	    public String getMethod() {
	        return method;
	    }

	    // Getter for action
	    public String getAction() {
	        return action;
	    }

	    // Method to get HttpMethod from string (for method or action)
	    public static HttpMethod fromString(String value) {
	        for (HttpMethod httpMethod : HttpMethod.values()) {
	            // Compare with both method (GET, POST...) and action (fetch, create...)
	            if (httpMethod.method.equalsIgnoreCase(value) || httpMethod.action.equalsIgnoreCase(value)) {
	                return httpMethod;
	            }
	        }
	        throw new IllegalArgumentException("Unknown method or action: " + value);
	    }
	}


    public enum LogicalOperator {
        AND("AND"),
        OR("OR"),
        NOT("NOT"),
        NULL("");

        private final String symbol;

        LogicalOperator(String symbol) {
            this.symbol = symbol;
        }

        public String getSymbol() {
            return symbol;
        }

        public static LogicalOperator fromString(String symbol) {
            for (LogicalOperator logicalOperator : LogicalOperator.values()) {
                if (logicalOperator.getSymbol().equalsIgnoreCase(symbol)) {
                    return logicalOperator;
                }
            }
            throw new IllegalArgumentException("Unknown logical operator: " + symbol);
        }
    }

    public enum JoinType {
        INNER("INNER"),
        LEFT("LEFT"),
        RIGHT("RIGHT"),
        FULL("FULL");

        private final String type;

        JoinType(String type) {
            this.type = type;
        }

        public String getType() {
            return type;
        }

        public static JoinType fromString(String type) {
            for (JoinType joinType : JoinType.values()) {
                if (joinType.getType().equalsIgnoreCase(type)) {
                    return joinType;
                }
            }
            throw new IllegalArgumentException("Unknown join type: " + type);
        }
    }

    public enum City {
        CHENNAI("chennai",1),
        MUMBAI("mumbai",2),
        DELHI("delhi",3),
        BANGALORE("bangalore",4),
        HYDERABAD("hyderabad",5),
        KOLKATA("kolkata",6),
        PUNE("pune",7);

        private final String name;
        private final int value;

        City(String name,int value) {
            this.name = name;
            this.value=value;
        }

        public String getName() {
            return name;
        }
        public int getValue()
        {
        	return value;
        }

        public static City fromString(String name) {
            for (City city : City.values()) {
                if (city.getName().equalsIgnoreCase(name)) {
                    return city;
                }
            }
            throw new IllegalArgumentException("Unknown city: " + name);
        }
        public static City fromValue(int value)
        {
        	for (City city : City.values()) {
                if (city.getValue() ==value) {
                    return city;
                }
            }
            throw new IllegalArgumentException("Unknown city: " + value);
        }
    }


    public enum UserType {
        CUSTOMER(1),
        MANAGER(2),
        SUPER_ADMIN(3);

        private final int value;

        UserType(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }

        public static UserType fromString(String type) {
            for (UserType userType : UserType.values()) {
                if (userType.getValue()==(Integer.parseInt(type))) {
                    return userType;
                }
            }
            throw new IllegalArgumentException("Unknown user type: " + type);
        }
    }
}
