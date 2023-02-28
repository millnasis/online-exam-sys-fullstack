package com.online_exam_sys.service.grade_student;

public interface GradeStudentService {
    public boolean studentQuitGradeByGradeId(Long gs_id);

    public boolean studentJoinGradeByGradeId(Long gs_id, Long st_id);

}
