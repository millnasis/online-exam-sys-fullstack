package com.online_exam_sys.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Student;

@Mapper
public interface StudentDao extends BaseMapper<Student> {
    @Select("SELECT st_password FROM exam_sys.student WHERE st_id = #{id}")
    public String getPwd(int id);
}
