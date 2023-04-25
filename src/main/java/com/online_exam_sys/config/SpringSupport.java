package com.online_exam_sys.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.online_exam_sys.controller.EntrySystemInterceptor;
import com.online_exam_sys.controller.ExamSystemInterceptor;
import com.online_exam_sys.controller.LoginInterceptor;

@Configuration
public class SpringSupport implements WebMvcConfigurer {
    @Autowired
    private LoginInterceptor loginInterceptor;

    @Autowired
    private EntrySystemInterceptor entrySystemInterceptor;

    @Autowired
    private ExamSystemInterceptor examSystemInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebMvcConfigurer.super.addInterceptors(registry);
        List<String> pt = new ArrayList<>();
        pt.add("/login/**");
        pt.add("/register/**");
        registry.addInterceptor(loginInterceptor).addPathPatterns(pt);
        registry.addInterceptor(entrySystemInterceptor).addPathPatterns("/student/**");
        registry.addInterceptor(entrySystemInterceptor).addPathPatterns("/teacher/**");
        registry.addInterceptor(examSystemInterceptor).addPathPatterns("/exam-client/**");
        registry.addInterceptor(examSystemInterceptor).addPathPatterns("/exam-controller/**");
    }

}
