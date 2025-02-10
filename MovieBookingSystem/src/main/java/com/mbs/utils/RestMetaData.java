package com.mbs.utils;

import java.io.IOException;
import java.util.HashMap;
import javax.servlet.http.Cookie;


import javax.servlet.http.HttpServletRequest;
import org.json.JSONException;
import org.json.JSONObject;

import com.mbs.utils.Constants.HttpMethod;

public class RestMetaData {

    private String uri;
    private HttpMethod method;
    private String queryString;

    private HashMap<String,Integer> identifiers;
    private String[] includes;
    private HashMap<String,String> filters;
    private JSONObject payloadData;
    
    private String packageName;
    private String handlerClass;
    private String invokeMethod;
    
    private Cookie[] cookies;
    
    // Constructor
    public RestMetaData(HttpServletRequest request) {
        this.uri = request.getRequestURI();
        System.out.println("URI RECIEVED: "+uri);
        uri = uri.replaceFirst("/api/v1/", "");
        
        System.out.println("CURRENT URI: "+uri);        
        System.out.println(request.getMethod());

        System.out.println(HttpMethod.fromString(request.getMethod()));
        this.method = HttpMethod.fromString(request.getMethod());
        System.out.println("RMD METHOD: "+method);

        if (this.method == HttpMethod.POST || this.method == HttpMethod.PUT) {
            try {
                this.payloadData = JsonConverter.ajaxDataToJson(request.getInputStream());
            } catch (JSONException | IOException e) {
                e.printStackTrace();
            }
        } else {
            this.payloadData = null;
        }

        this.queryString = request.getQueryString();

        Object[] object = RestAdapter.findPackageAndClass(uri);
        this.packageName = (String) object[0];
        this.handlerClass = (String) object[1];
        this.invokeMethod = method.getAction();
        System.out.println("INVOKE METHOD "+invokeMethod);
        
        this.identifiers = (HashMap<String, Integer>) object[2];
        if (this.queryString != null) {
        	Object[] objects=RestAdapter.formQueryParams(queryString);
        	this.includes=(String[]) objects[0];
        	this.filters=(HashMap<String, String>) objects[1];
            System.out.println("AVAILABLE");
        } else {
            this.includes = null;
            this.filters=null;
            System.out.println("NOT AVAILABLE");
        }
        try {
            if(request.getCookies().length!=0)
            {
            	this.cookies=request.getCookies();
            }
        }catch(Exception e)
        {
        	System.out.println("No cookies");
        }
    }

    public String getHandlerClassName() {
        return this.packageName + "." + this.handlerClass;
    }

    // Getter and Setter methods
    public JSONObject getPayloadData() {
        return this.payloadData;
    }

    public HashMap<String,Integer> getIdentifiers() {
        return identifiers;
    }

    public void setIdentifiers(HashMap<String,Integer> identifiers) {
        this.identifiers = identifiers;
    }

    public String[] getInclude() {
    	return this.includes;
    }
    public HashMap<String,String> getFilters(){
    	return this.filters;
    }
    
    public String getHandlerClass() {
        return this.handlerClass;
    }

    public void setHandlerClass(String handlerClass) {
        this.handlerClass = handlerClass;
    }

    public String getInvokeMethod() {
        return this.invokeMethod;
    }

    public void setInvokeMethod(String invokeMethod) {
        this.invokeMethod = invokeMethod;
    }

    public String getPackageName() {
        return this.packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getUri() {
        return this.uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public HttpMethod getMethod() {
        return this.method;
    }

    public void setMethod(HttpMethod method) {
        this.method = method;
    }

    public String getQueryString() {
        return this.queryString;
    }

    public void setQueryString(String queryString) {
        this.queryString = queryString;
    }
    public void setCookies(Cookie cookie)
    {
    	this.cookies[cookies.length-1]=cookie;
    }
    public Cookie[] getCookies() {
    	return this.cookies;
    }

    public Cookie getCookieByName(String key) {
        for (int i = 0; i < this.cookies.length; i++) {
            if (cookies[i].getName().equals(key)) {
                return cookies[i]; // Return the cookie if found
            }
        }
        return null;
    }
}
