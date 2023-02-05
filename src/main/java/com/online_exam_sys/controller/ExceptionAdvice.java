package com.online_exam_sys.controller;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

@RestControllerAdvice
public class ExceptionAdvice {
    @ExceptionHandler(Exception.class)
    public Result doExceptionAdvice(Exception e) {
        return new Result(e, "system go wrong，fix your shit", Constant.code.sys_err);
    }
}
