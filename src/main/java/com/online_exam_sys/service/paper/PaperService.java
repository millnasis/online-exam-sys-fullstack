package com.online_exam_sys.service.paper;

import java.util.List;

import com.online_exam_sys.pojo.Paper;

public interface PaperService {
    public List<Paper> queryPaperListByStudentId(Long st_id);

    public List<Paper> queryPaperListByGradeId(Long gr_id);
}
