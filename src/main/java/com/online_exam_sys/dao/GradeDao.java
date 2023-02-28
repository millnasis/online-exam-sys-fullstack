package com.online_exam_sys.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Grade;

@Mapper
public interface GradeDao extends BaseMapper<Grade> {

    @Select("SELECT grade.* FROM grade, grade_student WHERE grade_student.st_id = #{id} AND grade.gr_id = grade_student.gr_id")
    public List<Grade> queryGradeListByStudentId(Long id);
}
