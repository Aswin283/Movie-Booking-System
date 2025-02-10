package com.mbs.utils;

import com.mbs.utils.Constants.HttpMethod;
import com.mbs.utils.Constants.UserType;
public class Authorization {
	
	public enum authorizationEnums{
		
		login("login",false,HttpMethod.POST,"/authentication/login"),
		logout("logout",false,HttpMethod.DELETE,"/authentication/logout"),
		register("register",false,HttpMethod.POST,"/authentication/register"),
		auth("auth",false,HttpMethod.GET,"authentication"),
		
		getuser("getUser",true,HttpMethod.GET,"getusers",new UserType[] {UserType.MANAGER,UserType.SUPER_ADMIN}),
		
		addMovie("addMovies",true,HttpMethod.POST,"movies",new UserType[] {UserType.SUPER_ADMIN}),
		showMovies("showMovies",false,HttpMethod.GET,"movies"),
		showMovie("showMoviesId",false,HttpMethod.GET,"movies/{0}"),
		
		
		addTheatre("addTheatre",true,HttpMethod.POST,"theatres",new UserType[] {UserType.SUPER_ADMIN}),
		updateManager("updateManager",true,HttpMethod.POST,"theatres/{0}",new UserType[] {UserType.SUPER_ADMIN}),
		showTheatres("showTheatres",false,HttpMethod.GET,"theatres"),
		showTheatre("showTheatresId",false,HttpMethod.GET,"theatres/{0}"),
		addShow("addShow",true,HttpMethod.POST,"theatres/{0}/shows",new UserType[] {UserType.MANAGER}),
		deleteShow("deleteShow",true,HttpMethod.PUT,"theatres/{0}/shows/{1}",new UserType[] {UserType.MANAGER}),
		
		updateUser("updateUser",true,HttpMethod.PUT,"users/{0}/update",new UserType[] {UserType.CUSTOMER,UserType.MANAGER,UserType.SUPER_ADMIN}),

		showShows("showShows",false,HttpMethod.GET,"theatres/{0}/shows"),
		showShow("showShows",false,HttpMethod.GET,"theatres/{0}/shows/{1}"),
		showSeats("showSeats",false,HttpMethod.GET,"theatres/{0}/shows/{1}/seats"),
		collection("collection",true,HttpMethod.GET,"theatres/{0}/shows/{1}/collections",new UserType[] {UserType.MANAGER}),

		
		showShowsMovie("showShows",false,HttpMethod.GET,"movies/{0}/shows"),//
		showShowMovie("showShows",false,HttpMethod.GET,"movies/{0}/shows/{1}"),//
		showSeatsMovie("showSeats",false,HttpMethod.GET,"movies/{0}/shows/{1}/seats"),//
		
		bookTicket("bookTicket",true,HttpMethod.POST,"users/{0}/bookings",new UserType[] {UserType.CUSTOMER,UserType.MANAGER,UserType.SUPER_ADMIN}),
		showBookings("showBookings",true,HttpMethod.GET,"users/{0}/bookings",new UserType[] {UserType.CUSTOMER,UserType.MANAGER,UserType.SUPER_ADMIN}),		
		showBooking("showBookingsId",true,HttpMethod.GET,"users/{0}/bookings/{1}",new UserType[] {UserType.CUSTOMER,UserType.MANAGER,UserType.SUPER_ADMIN}),		
		deleteBooking("deleteBooking",true,HttpMethod.PUT,"users/{0}/bookings/{1}",new UserType[] {UserType.CUSTOMER,UserType.MANAGER,UserType.SUPER_ADMIN});
		
		
	    private String description;
	    private boolean isAuthRequired;
	    private HttpMethod httpMethod;
	    private String url;
	    private UserType[] userTypes;
	
	    authorizationEnums(String description, boolean isAuthRequired, HttpMethod httpMethod, String url,UserType[] userTypes) {
	        this.userTypes = userTypes;
	        this.description = description;
	        this.isAuthRequired = isAuthRequired;
	        this.httpMethod = httpMethod;
	        this.url = url;
	    }
	    authorizationEnums(String description, boolean isAuthRequired, HttpMethod httpMethod, String url) {
	        this.userTypes = null;
	        this.description = description;
	        this.isAuthRequired = isAuthRequired;
	        this.httpMethod = httpMethod;
	        this.url = url;
	    }
	    
	    public UserType[] getUserType() {
	        return userTypes;
	    }

	    public String getDescription() {
	        return description;
	    }

	    public boolean isAuthRequired() {
	        return isAuthRequired;
	    }

	    public HttpMethod getHttpMethod() {
	        return httpMethod;
	    }

	    public String getUrl() {
	        return url;
	    }
	    public String getFormattedUrl(String... params) {
	        String formattedUrl = url;
	        for (int i = 0; i < params.length; i++) {
	            // Replace placeholders {0}, {1}, etc., with actual values
	            formattedUrl = formattedUrl.replace("{" + i + "}", params[i]);
	        }
	        return formattedUrl;
	    }

	    public static authorizationEnums findByUrl(String actualUrl,HttpMethod method) {

	    	System.out.println("ACTUAL URL: "+actualUrl);
	    	String formattedUrl = convertToPatternUrl(actualUrl);
	    	System.out.println(method);

	        for (authorizationEnums enumValue : authorizationEnums.values()) {
	        	System.out.println("\n"+enumValue);
	        	System.out.println("f: "+formattedUrl+"\ne: "+enumValue.getUrl()+"\n");
	        	System.out.println(method.getAction());
	        	System.out.println(enumValue.getHttpMethod().getAction());
	            if (formattedUrl.equals(enumValue.getUrl()) && enumValue.getHttpMethod().getAction().equals(method.getAction())) {
	                return enumValue;
	            }
	        }
	        return null;
	    }
	    public static boolean validRequest(authorizationEnums enumValue,UserType userType)
	    {
	    	if(enumValue.getUserType()==null)
	    	{
	    		return true;
	    	}
	    	else{
	    		if(userType!=null)
	    		{

	    			for(UserType user : enumValue.getUserType())
		    		{
		    			if(user.getValue()==userType.getValue())
		    			{
		    				return true;
		    			}
		    		}
	    		}
	    	}
	    	
	    	return false;
	    }
	  

	    public static String convertToPatternUrl(String actualUrl) {
	        String[] urlSegments = actualUrl.split("/");
	        StringBuilder formattedUrl = new StringBuilder();

	        int placeholderIndex = 0;
	        for (String segment : urlSegments) {
	            if (segment.matches("\\d+")) {
	                formattedUrl.append("{").append(placeholderIndex).append("}");
	                placeholderIndex++;
	            } else {
	                formattedUrl.append(segment);
	            }
	            formattedUrl.append("/"); 
	        }
	        if (formattedUrl.length() > 0 && formattedUrl.charAt(formattedUrl.length() - 1) == '/') {
	            formattedUrl.deleteCharAt(formattedUrl.length() - 1);
	        }

	        return formattedUrl.toString();
	    }
	   public static boolean userCheck(UserType[] userTypes, UserType userType)
	   {
		   for(UserType user:userTypes)
		   {
			   if(user.getValue()==userType.getValue())
			   {
				   return true;
			   }
		   }
		   return false;
	   }
	}
}


