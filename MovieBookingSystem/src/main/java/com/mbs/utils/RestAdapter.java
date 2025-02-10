package com.mbs.utils;

import java.util.HashMap;
import com.mbs.utils.Constants.HttpMethod;

public class RestAdapter {
    private static String packagePrefix = "com.mbs.handlers.";
    
    public static HttpMethod invokeMethod(HttpMethod httpMethod) {
        return httpMethod; // Return the passed HttpMethod
    }

    public static Object[] formQueryParams(String queryString) {
    	Object[] objects = new Object[2];
    	HashMap <String,String> filters=new HashMap<>();
        String[] includeParams = {};
        queryString= queryString.replace("+", " ");
        queryString= queryString.replace("%20", " ");
        String[] pairs = queryString.split("&");

        try {
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    if (keyValue[0].startsWith("include")) {
                        includeParams = keyValue[1].split(",");
                    } else {
                        filters.put(keyValue[0], keyValue[1]);
                    }
                } else {
                    filters.put(keyValue[0], "");
                }
            }
        } catch (Exception e) {
            System.out.println("Error Occurred in formQueryParams: " + e);
        }
        objects[0]=includeParams;
        objects[1]=filters;
        return objects;
    }

    public static Object[] findPackageAndClass(String request) {
    	System.out.println("REQUEST URI "+request);
        String[] resources = request.split("/");
        String packageName = packagePrefix;
        String className = "";
        HashMap<String,Integer> idValues = new HashMap<>();

        if (resources.length == 1) {
        	className = resources[0];
        }
        else if(resources.length==2) {
        	try {

                System.out.println(resources[0]+" "+resources[1]);
        		className = resources[0];
				idValues.put(resources[0],Integer.parseInt(resources[1]));
			} catch (Exception e) {
				e.printStackTrace();
			}
        }
        else {
        	if(resources.length%2==0) {
        		System.out.println("EVEN LENGTH");
        	    for (int i = 0; i < resources.length-1; i++) {
                    if (i == resources.length - 2) {
                        className = resources[i];
                        idValues.put(resources[i], Integer.parseInt(resources[i+1]));

                    } else if (i % 2 == 0) {
                        packageName += resources[i] + ".";
                    } else {
                        try {
                            idValues.put(resources[i - 1], Integer.parseInt(resources[i]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }	
        	}
        	else {
        		System.out.println("ODD LENGTH");
        	    for (int i = 0; i < resources.length; i++) {
                    if (i == resources.length - 1) {
                        className = resources[i];
                    } else if (i % 2 == 0) {
                        packageName += resources[i] + ".";
                    } else {
                        try {
                            idValues.put(resources[i - 1], Integer.parseInt(resources[i]));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }	
        	}        		
        	
        }
        className = className.substring(0, 1).toUpperCase() + className.substring(1) + "Handler";
        packageName = packageName.substring(0, packageName.length() - 1);

        return new Object[]{packageName, className, idValues};
    }
}
