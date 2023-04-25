package com.online_exam_sys.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ExamSystemInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        HttpSession session = request.getSession();
        if (session.getAttribute("user_id") == null) {
            response.sendRedirect("/login");
            return false;
        } else {
            Object identity = session.getAttribute("identity");
            if (identity == "st") {
                if (!request.getRequestURI().equals("/exam-client")) {
                    response.sendRedirect("/exam-client");
                }
            } else {
                if (!request.getRequestURI().equals("/exam-controller")) {
                    response.sendRedirect("/exam-controller");
                }
            }
        }
        return true;
    }
}
