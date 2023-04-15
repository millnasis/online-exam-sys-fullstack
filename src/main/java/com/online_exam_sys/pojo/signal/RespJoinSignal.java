package com.online_exam_sys.pojo.signal;

import lombok.Data;

@Data
public class RespJoinSignal {
    private String remoteUid;
    private Object[] studentIdList;
    private Object[] teacherIdList;
}
