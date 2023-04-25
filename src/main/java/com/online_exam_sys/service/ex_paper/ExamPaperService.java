package com.online_exam_sys.service.ex_paper;

import java.util.List;

import com.online_exam_sys.pojo.Ex_paper;
import com.online_exam_sys.pojo.Paper;

public interface ExamPaperService {
    public Ex_paper queryExamPaperByPaperIdAndStudentId(int pa_id, int st_id);

    public boolean generateExamPaperByPaper(Paper paper);

    public Ex_paper queryById(int id);

    public List<Ex_paper> queryListByPaperId(int pa_id);

    public boolean handInPaperByPaper(Paper paper);

    public boolean updateById(Ex_paper ex_paper);

    public Ex_paper autoCorrectPaperByPaper(Ex_paper ex_paper);
}
