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
    public List<Paper> queryPaperListByStudentId(int st_id) {
        return paperDao.queryPaperListByStudentId(st_id);
    }

    @Override
    public List<Paper> queryPaperListByGradeId(int gr_id) {
        LambdaQueryWrapper<Paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Paper::getGr_id, gr_id);
        List<Paper> data = paperDao.selectList(lqw);
        return data;
    }

    @Override
    public Paper queryById(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'queryById'");
    }

    @Override
    public boolean delete(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    @Override
    public boolean add(Paper paper) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'add'");
    }

    @Override
    public boolean update(Paper paper) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

}
