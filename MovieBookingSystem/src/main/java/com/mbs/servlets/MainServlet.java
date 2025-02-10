package com.mbs.servlets;

import com.mbs.utils.*;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MainServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	String origin=request.getHeader("Origin");
    	if(origin!=null && !origin.isEmpty())
    	{
    		
    	}
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        	response.setHeader("Access-Control-Allow-Methods", "*");
    		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin ,Accept");
        	response.setHeader("Access-Control-Allow-Credentials", "true");
        	response.setHeader("Access-Control-Allow-Origin",origin);
        	response.setStatus(200);
        	return;
        }
    	RestMetaData metaData=new RestMetaData(request);
    	System.out.println("identifiers: "+metaData.getIdentifiers().toString());
    	System.out.println("filters: "+metaData.getFilters());
    	try {
    		
    		response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");  // Specify your front-end domain
    		response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin ,Accept");
    		response.setHeader("Access-Control-Allow-Credentials", "true");  // Allow credentials (cookies)
    		response.setHeader("Access-Control-Max-Age", "3600");  
   
        	System.out.println("HANDLER CLASS NAME: "+metaData.getHandlerClassName());

             Class<?> handlerClass = Class.forName(metaData.getHandlerClassName());

             Object handlerClassInstance = handlerClass.getDeclaredConstructor().newInstance();
        	 String methodName = metaData.getInvokeMethod();

             Method methodToInvoke = handlerClass.getMethod(methodName, RestMetaData.class, HttpServletResponse.class);
             methodToInvoke.invoke(handlerClassInstance, metaData,response);

        } catch (Exception e) {
        	System.out.println("Error Occured at MainServlet service "+e);
            e.printStackTrace();
        }
    }  
}
