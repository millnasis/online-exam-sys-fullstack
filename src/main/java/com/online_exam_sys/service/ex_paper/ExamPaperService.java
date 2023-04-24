package com.online_exam_sys.service.ex_paper;

import com.online_exam_sys.pojo.Ex_paper;
import com.online_exam_sys.pojo.Paper;

public interface ExamPaperService {
    public Ex_paper queryExamPaperByPaperIdAndStudentId(int pa_id, int st_id);

    public boolean generateExamPaperByPaper(Paper paper);

    public Ex_paper queryById(int id);
}
