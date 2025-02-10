package com.mbs.utils;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class GetConnection {
	public static Connection GetConnection() {
		try {
			Class.forName("org.postgresql.Driver");
	  	    String url = "jdbc:postgresql://localhost:5432/aswin-pt7698";
	  	    String dbusername = "aswin-pt7698";
	  	    String dbpassword = "";

	  	    Connection con= DriverManager.getConnection(url, dbusername, dbpassword);
	  	    return con;		
	  	} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}catch(SQLException e){
			e.printStackTrace();
		}
		return null;
	}
}
