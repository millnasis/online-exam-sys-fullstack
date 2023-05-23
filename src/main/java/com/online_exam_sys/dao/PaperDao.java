package com.online_exam_sys.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Paper;

@Mapper
public interface PaperDao extends BaseMapper<Paper> {

    @Select("SELECT jopa.*, grade.gr_name FROM (SELECT  * FROM paper WHERE gr_id IN (SELECT  gr_id FROM grade_student WHERE st_id = ${st_id})) AS jopa, grade WHERE jopa.gr_id = grade.gr_id;")
    public List<Paper> queryPaperListByStudentId(int st_id);

    @Select("SELECT jopa.*, grade.gr_name FROM (SELECT  * FROM paper WHERE gr_id IN (SELECT  gr_id FROM grade WHERE te_id = ${te_id})) AS jopa, grade WHERE jopa.gr_id = grade.gr_id")
    public List<Paper> queryPaperListByTeacherId(int te_id);

    @Select("SELECT paper.*, teacher.te_name, teacher.te_card, grade.gr_name FROM teacher, paper, grade WHERE paper.pa_id = #{pa_id} AND paper.gr_id = grade.gr_id AND grade.te_id = teacher.te_id")
    public Paper joinQueryPaperByPaperId(int pa_id);
}
