package com.online_exam_sys.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.online_exam_sys.pojo.Paper;

@Mapper
public interface PaperDao extends BaseMapper<Paper> {
    @Select("SELECT  * FROM paper WHERE gr_id = (SELECT  gr_id FROM grade_student WHERE st_id = #{st_id})")
    public List<Paper> queryPaperListByStudentId(int st_id);
}
