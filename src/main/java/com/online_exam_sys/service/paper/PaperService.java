package com.online_exam_sys.service.paper;

import java.util.List;

import com.online_exam_sys.pojo.Paper;

public interface PaperService {
    public List<Paper> queryPaperListByStudentId(int st_id);

    public List<Paper> queryPaperListByGradeId(int gr_id);

    public Paper queryById(int id);

    public boolean delete(int id);

    public boolean add(Paper paper);

    public boolean update(Paper paper);
}
