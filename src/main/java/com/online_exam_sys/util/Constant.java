package com.online_exam_sys.util;

public interface Constant {
    interface code {
        int error = -1;
        int success = 200;
        int sys_err = 500;
        int not_found = 404;
        int account_exist = 40301;
    }

    interface sex {
        String female = "F";
        String male = "M";
    }

    interface paper_state {
        String preparing = "PREPARING";
        String waiting = "WAITING";
        String starting = "STARTING";
        String end = "END";
    }

    interface question_type {
        String choose = "CHO";
        String fill = "FIL";
        String subject = "SUB";
    }

    interface exam_paper_state {
        String ongoing = "ONGOING";
        String cheating = "CHEATING";
        // 批改中
        String correcting = "CORRECTING";
        String finished = "FINISHED";
    }
}
