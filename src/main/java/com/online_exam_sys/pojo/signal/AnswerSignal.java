package com.online_exam_sys.pojo.signal;

import lombok.Data;

@Data
public class AnswerSignal {
    private String uid;
    private String remoteUid;
    private String msg;
}
