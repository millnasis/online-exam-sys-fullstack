package com.online_exam_sys.dao;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Grade;

@Mapper
public interface GradeDao extends BaseMapper<Grade>{
    
}
