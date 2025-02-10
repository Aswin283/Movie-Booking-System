package com.mbs.utils.queryHandler;

import java.util.ArrayList;
import java.util.List;

import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.TableNames;

public class Join {
	private JoinType joinType;
	private TableNames primaryTableName;
	private TableNames secondaryTableName;
	private String primaryKey;
	private String foreignKey;
    
	public Join(JoinType joinType,TableNames primaryTableName, TableNames secondaryTableName, String primaryKey, String foreignKey) {
        this.joinType=joinType;
		this.primaryTableName = primaryTableName;
        this.secondaryTableName = secondaryTableName;
        this.primaryKey = primaryKey;
        this.foreignKey = foreignKey;
    }


	public JoinType getJoinType() {
		return joinType;
	}
	public TableNames getPrimaryTableName() {
        return primaryTableName;
    }

    public TableNames getSecondaryTableName() {
        return secondaryTableName;
    }

    public String getPrimaryKey() {
        return primaryKey;
    }

    public String getForeignKey() {
        return foreignKey;
    }

}





