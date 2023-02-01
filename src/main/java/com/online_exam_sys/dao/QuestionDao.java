package com.online_exam_sys.dao;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Question;

@Mapper
public interface QuestionDao extends BaseMapper<Question> {

}
