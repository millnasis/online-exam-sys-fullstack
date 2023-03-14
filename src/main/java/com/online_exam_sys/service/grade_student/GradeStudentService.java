package com.online_exam_sys.service.grade_student;

public interface GradeStudentService {
    public boolean studentQuitGradeByGsId(int gs_id);

    public boolean studentJoinGradeByGradeId(int gr_id, int st_id);

}
