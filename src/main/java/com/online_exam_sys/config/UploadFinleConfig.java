package com.online_exam_sys.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

@Configuration
public class UploadFinleConfig {
    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver cmr = new CommonsMultipartResolver();
        return cmr;
    }
}
