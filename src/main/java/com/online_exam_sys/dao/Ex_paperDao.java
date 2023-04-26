package com.online_exam_sys.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Ex_paper;

@Mapper
public interface Ex_paperDao extends BaseMapper<Ex_paper> {
    @Select("SELECT ex_paper.*, student.st_name FROM student, ex_paper WHERE ex_paper.pa_id = #{pa_id} AND ex_paper.st_id = student.st_id")
    public List<Ex_paper> queryExamPaperAndStudentNameByPaId(int pa_id);
}
