package com.online_exam_sys.service.grade;

import java.util.List;

import com.online_exam_sys.pojo.Grade;

public interface GradeService {
    public List<Grade> queryGradeListByStudentId(int id);
}
