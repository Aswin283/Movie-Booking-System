package com.mbs.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;

import com.mbs.utils.Authorization.authorizationEnums;
import com.mbs.utils.Constants.HttpMethod;
import com.mbs.utils.Constants.JoinType;
import com.mbs.utils.Constants.Operator;
import com.mbs.utils.Constants.TableNames;
import com.mbs.utils.Constants.UserType;
import com.mbs.utils.EncryptionDecryption;
import com.mbs.utils.queryHandler.Condition;
import com.mbs.utils.queryHandler.Join;
import com.mbs.utils.queryHandler.QueryBuilder;
import com.mbs.utils.queryHandler.QueryExecutor;

public class SessionFilter extends HttpFilter implements Filter {
    private static final Logger logger = LogManager.getLogger(SessionFilter.class);

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // CORS Headers
        httpResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
        httpResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");

        String url = httpRequest.getRequestURI().replace("/api/v1/", "");
        HttpMethod method = HttpMethod.fromString(httpRequest.getMethod());

        authorizationEnums foundEnum = authorizationEnums.findByUrl(url, method);

        if (foundEnum == authorizationEnums.auth) {
            handleAuthorization(httpRequest, httpResponse);
            return;
        }

        if (!foundEnum.isAuthRequired() || authorizationEnums.validRequest(foundEnum, null)) {
            chain.doFilter(request, response);
        } else {
            handleSessionValidation(httpRequest, httpResponse, chain, foundEnum);
        }
    }

    private void handleAuthorization(HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException {
        try {
            String encryptedUserId = getCookieByName(httpRequest.getCookies(), "userSession").getValue();
            String userId = EncryptionDecryption.decrypt(encryptedUserId, EncryptionDecryption.getFixedSecretKey());

            QueryBuilder qb = new QueryBuilder();
            qb.setColumns()
              .setJoin(new Join(JoinType.INNER, TableNames.USER, TableNames.ADDRESS, "address_id", "address_id"))
              .setCondition(new Condition(TableNames.USER, "user_id", Operator.EQUALS, Integer.parseInt(userId)));

            String query = qb.getSelectQuery();
            JSONArray result = QueryExecutor.executeQuery(query, qb.getValues());

            if (result.length() != 0) {
                sendJsonResponse(httpResponse, HttpServletResponse.SC_OK, "{\"success\": true, \"data\": " + result + "}");
            } else {
                sendJsonResponse(httpResponse, HttpServletResponse.SC_UNAUTHORIZED, "{\"success\": false, \"error\": \"Unauthorized access\"}");
            }
        } catch (Exception e) {
            logger.error("Error during authorization", e);
            sendJsonResponse(httpResponse, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "{\"success\": false, \"error\": \"Internal server error\"}");
        }
    }

    private void handleSessionValidation(HttpServletRequest httpRequest, HttpServletResponse httpResponse, FilterChain chain,
                                         authorizationEnums foundEnum) throws IOException, ServletException {
        Cookie userSessionCookie = getCookieByName(httpRequest.getCookies(), "userSession");

        if (userSessionCookie == null) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            try {
                String encryptedUserId = userSessionCookie.getValue();
                String userId = EncryptionDecryption.decrypt(encryptedUserId, EncryptionDecryption.getFixedSecretKey());

                if (userId != null) {
                    QueryBuilder qb = new QueryBuilder();
                    qb.setColumns("user_id", "type")
                      .setTableName(TableNames.USER)
                      .setCondition(new Condition("user_id", Operator.EQUALS, Integer.parseInt(userId)));

                    JSONArray result = QueryExecutor.executeQuery(qb.getSelectQuery(), qb.getValues());

                    if (result.length() != 0) {
                        UserType userType = UserType.fromString(result.getJSONObject(0).get("USER_type").toString());

                        if (authorizationEnums.validRequest(foundEnum, userType)) {
                            chain.doFilter(httpRequest, httpResponse);
                        } else {
                            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        }
                    } else {
                        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    }
                } else {
                    httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                }
            } catch (Exception e) {
                logger.error("Error during session validation", e);
                httpResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        }
    }

    private void sendJsonResponse(HttpServletResponse response, int status, String jsonResponse) throws IOException {
        response.setContentType("application/json");
        response.setStatus(status);
        response.getWriter().write(jsonResponse);
    }

    public static Cookie getCookieByName(Cookie[] cookies, String key) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(key)) {
                    return cookie;
                }
            }
        }
        return null;
    }
}
