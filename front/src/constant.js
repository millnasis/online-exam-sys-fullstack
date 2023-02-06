export default {
  code: {
    error: -1,
    success: 200,
    sys_err: 500,
    not_found: 404,
  },

  sex: {
    female: "F",
    male: "M",
  },

  paper_state: {
    preparing: "PREPARING",
    waiting: "WAITING",
    starting: "STARTING",
    end: "END",
  },

  question_type: {
    choose: "CHO",
    fill: "FIL",
    subject: "SUB",
  },

  exam_paper_state: {
    ongoing: "ONGOING",
    cheating: "CHEATING",
    // 批改中
    correcting: "CORRECTING",
    finished: "FINISHED",
  },
};
