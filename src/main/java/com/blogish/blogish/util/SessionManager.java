package com.blogish.blogish.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class SessionManager {
    public static String SESSION_KEY_USER = "user";

    public static boolean setSessionValue (HttpServletRequest request, String sessionKey, Object sessionValue) throws IllegalStateException {
        HttpSession session = request.getSession();
        boolean valueExist = session.getAttribute(sessionKey) != null;
        session.setAttribute(sessionKey, sessionValue);
        return valueExist;
    }

    public static Object getSessionValue(HttpServletRequest request, String sessionKey) throws NullPointerException, IllegalStateException {
        HttpSession session = request.getSession();
        if (session.getAttribute(sessionKey) == null) {
            throw new NullPointerException();
        }
        return session.getAttribute(sessionKey);
    }

    public static void removeSessionValue(HttpServletRequest request, String sessionKey) throws NullPointerException, IllegalStateException {
        HttpSession session = request.getSession();
        if (session.getAttribute(sessionKey) == null) {
            throw new NullPointerException();
        }
        session.removeAttribute(sessionKey);
    }
}
