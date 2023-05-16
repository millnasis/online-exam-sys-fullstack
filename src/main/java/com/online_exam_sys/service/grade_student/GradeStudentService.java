package com.online_exam_sys.service.grade_student;

public interface GradeStudentService {
    public boolean studentQuitGradeByGsId(int gs_id);

    public boolean studentJoinGradeByGradePassword(String gr_password, int st_id);

}
