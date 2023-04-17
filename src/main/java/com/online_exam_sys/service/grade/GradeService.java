package com.online_exam_sys.service.grade;

import java.util.List;

import com.online_exam_sys.pojo.Grade;

public interface GradeService {
    public List<Grade> queryGradeListByStudentId(int id);

    public List<Grade> queryGradeListByTeacherId(int id);

    public Grade queryGradeById(int id);

    public boolean delete(int id);

    public boolean add(Grade grade);

    public boolean update(Grade grade);
}
