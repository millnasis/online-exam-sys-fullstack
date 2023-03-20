package com.online_exam_sys.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Student;

@Mapper
public interface StudentDao extends BaseMapper<Student> {
    @Select("SELECT st_password FROM exam_sys.student WHERE st_id = #{id}")
    public String getPwd(int id);

    @Select("SELECT  * FROM exam_sys.student WHERE st_id = (SELECT  grade_student.st_id FROM grade_student WHERE gr_id = #{gr_id})")
    public List<Student> queryStudentByGrId(int gr_id);
}
