package com.mbs.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.mbs.handlers.*;
import com.mbs.utils.CreateResponseJSONObject;
import com.mbs.utils.JsonConverter;

public class AuthenticationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        try {
        	  response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
              response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
              response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
              response.setHeader("Access-Control-Allow-Credentials", "true");
              
        	if(request.getRequestURI().contains("/authentication/login"))
        	{
            	JSONObject payloadData = JsonConverter.ajaxDataToJson(request.getInputStream());
        		AuthenticationHandler authenticationHandler=new AuthenticationHandler(payloadData, response);
        		JSONArray result=authenticationHandler.login();
        		JSONObject userDetails=new JSONObject();
        		if(result!=null)
        		{
        			userDetails.put("success", true);
        			userDetails.put("data",result);
        			
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write(userDetails.toString());

        		}
        		else {
            		response.setContentType("text/plain");
            		response.setCharacterEncoding("UTF-8");

            		String message = "No such user found";

    	            PrintWriter out = response.getWriter();
    	            out.print(message);  // Send the plain text
    	            out.flush();
            		response.setStatus(409);
        		}
        	}
        	else if(request.getRequestURI().contains("/authentication/logout"))
        	{  
        		AuthenticationHandler authenticationHandler=new AuthenticationHandler(null,response);
        		authenticationHandler.logout();
        	}
        	else if(request.getRequestURI().contains("/authentication/register"))
        	{    
        		JSONObject payloadData = JsonConverter.ajaxDataToJson(request.getInputStream());
        		AuthenticationHandler authenticationHandler=new AuthenticationHandler(payloadData, response);
        		JSONObject isRegistered=authenticationHandler.register();
        		response.setStatus(isRegistered.getInt("status"));
        		response.getWriter().write(isRegistered.toString());        		
        	}
        	else {
        		response.setStatus(404);
        		response.getWriter().write((CreateResponseJSONObject.createResponse(new JSONArray(), 404, false, "Invalid Request").toString()));
        	}
        	

        } catch (Exception e) {
            System.out.println("Error Occurred in Authentication Servlet service: " + e);
            e.printStackTrace();
        }
    }
}