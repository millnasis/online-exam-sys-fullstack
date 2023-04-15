package com.online_exam_sys.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class EntrySystemInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
                HttpSession session = request.getSession();
                if (session.getAttribute("user_id") == null) {
                    response.sendRedirect("/login");
                    return false;
                }
                return true;
    }
}
