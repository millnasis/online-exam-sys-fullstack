package com.online_exam_sys.service.grade.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.online_exam_sys.dao.GradeDao;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.service.grade.GradeService;

@Service
public class GradeServiceImpl implements GradeService {

    @Autowired
    private GradeDao gradeDao;

    @Override
    public List<Grade> queryGradeListByStudentId(Long id) {
        return gradeDao.queryGradeListByStudentId(id);
    }

}
