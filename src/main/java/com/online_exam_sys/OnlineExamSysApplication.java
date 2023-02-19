package com.online_exam_sys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class OnlineExamSysApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineExamSysApplication.class, args);
		log.info("服务器运行在 https://localhost:8443/ ........");
	}

}
