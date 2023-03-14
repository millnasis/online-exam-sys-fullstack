package com.online_exam_sys.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Teacher;

@Mapper
public interface TeacherDao extends BaseMapper<Teacher>{
    @Select("SELECT te_password FROM exam_sys.teacher WHERE te_id = #{id}")
    public String getPwd(int id);
}
