package com.online_exam_sys.service.grade.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.online_exam_sys.dao.GradeDao;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.service.grade.GradeService;

@Service
public class GradeServiceImpl implements GradeService {

    @Autowired
    private GradeDao gradeDao;

    @Override
    public List<Grade> queryGradeListByStudentId(int id) {
        return gradeDao.queryGradeListByStudentId(id);
    }

    public List<Grade> queryGradeListByTeacherId(int id) {
        LambdaQueryWrapper<Grade> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Grade::getTe_id, id);
        List<Grade> data = gradeDao.selectList(lqw);
        return data;
    }

    @Override
    public Grade queryGradeById(int id) {
        LambdaQueryWrapper<Grade> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Grade::getGr_id, id);
        Grade data = gradeDao.selectOne(lqw);
        return data;

    }

    @Override
    public boolean delete(int id) {
        int ret = gradeDao.deleteById(id);
        return ret > 0;
    }

    @Override
    public boolean add(Grade grade) {
        int ret = gradeDao.insert(grade);
        return ret > 0;
    }

    @Override
    public boolean update(Grade grade) {
        int ret = gradeDao.updateById(grade);
        return ret > 0;
    }

}
