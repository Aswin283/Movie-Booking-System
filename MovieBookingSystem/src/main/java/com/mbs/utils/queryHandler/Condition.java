package com.mbs.utils.queryHandler;

import com.mbs.utils.Constants.LogicalOperator;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;

public class Condition {
	private TableNames tableName;
    private String columnName;
    private Operator operator;
    private LogicalOperator logicalOperator;
    private Object value;
   
    public Condition(TableNames tableName, String columnName, Operator operator, LogicalOperator logicalOperator,Object value) {
        this.tableName=tableName;
    	this.columnName = columnName;
        this.operator = operator;
        this.logicalOperator=logicalOperator;
        this.value=value;
    }
    
    public Condition(TableNames tableName, String columnName, Operator operator,Object value) {
        this.logicalOperator=LogicalOperator.NULL;
    	this.tableName=tableName;
    	this.columnName = columnName;
        this.operator = operator;
        this.value=value;

    }
    
    public Condition(String columnName, Operator operator, LogicalOperator logicalOperator,Object value) {
    	this.columnName = columnName;
    	this.tableName=TableNames.NULL;
    	this.operator = operator;
        this.logicalOperator=logicalOperator;
        this.value=value;

    }
    public Condition(String columnName,Operator operator,Object value) {
        this.logicalOperator=LogicalOperator.NULL;
    	this.tableName=TableNames.NULL;
    	this.columnName = columnName;
        this.operator = operator;
        this.value=value;

    }
    

    public String getTableName() {
        return tableName.getTableName();
    }

    public String getColumnName() {
        return columnName;
    }

    public String getOperator() {
        return operator.getSymbol();
    }

    public String getLogicalOperator() {
        return logicalOperator.getSymbol();
    }
    public Object getValue() {
    	return value;
    }
}
