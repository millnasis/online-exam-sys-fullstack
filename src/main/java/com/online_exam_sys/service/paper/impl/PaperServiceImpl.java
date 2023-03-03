package com.online_exam_sys.service.paper.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.online_exam_sys.dao.PaperDao;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.service.paper.PaperService;

@Service
public class PaperServiceImpl implements PaperService {

    @Autowired
    private PaperDao paperDao;

    @Override
    public List<Paper> queryPaperListByStudentId(Long st_id) {
        return paperDao.queryPaperListByStudentId(st_id);
    }

    @Override
    public List<Paper> queryPaperListByGradeId(Long gr_id) {
        LambdaQueryWrapper<Paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Paper::getGr_id, gr_id);
        List<Paper> data = paperDao.selectList(lqw);
        return data;
    }

}
