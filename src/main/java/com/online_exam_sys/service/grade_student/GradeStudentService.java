package com.online_exam_sys.service.grade_student;

public interface GradeStudentService {
    public boolean studentQuitGradeByGsId(Long gs_id);

    public boolean studentJoinGradeByGradeId(Long gr_id, Long st_id);

}
