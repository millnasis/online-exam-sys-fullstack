import { Typography } from "antd";
import React from "react";
import request from "../../../request";
import axios from "axios";
import constant from "../../../constant";

const { Title, Paragraph } = Typography;

const fakeData = {
  pa_id: 21,
  gr_id: 3,
  pa_name: "fuck",
  pa_founddate: "2023-05-09T03:01:34.395+00:00",
  pa_state: "END",
  pa_begintime: "2023-05-09T18:03:03.287+00:00",
  pa_duringtime: 120,
  pa_order: "[45]",
  ep_list: [
    {
      ep_id: 34,
      st_id: 5,
      pa_id: 21,
      ep_begindate: "2023-05-09T08:18:26.585+00:00",
      ep_finishdate: "2023-05-09T08:21:39.480+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 1,
      st_name: null,
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 35,
      st_id: 6,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.497+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 0,
      st_name: null,
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 36,
      st_id: 7,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.568+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 0,
      st_name: null,
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 37,
      st_id: 8,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.668+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 0,
      st_name: null,
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 38,
      st_id: 9,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.800+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 0,
      st_name: null,
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
  ],
};

class CorrectPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperData: fakeData,
      examPaperData: {},
      examPaperQuestionData: [],
      currentExPaperId: -1,
      fetching: false,
    };
  }

  async switchExPaper(id = -1) {
    if (id !== -1) {
      this.setState({
        fetching: true,
        examPaperData: fakeData.ep_list.find((v) => v.ep_id === id),
      });
      await request(
        axios.get("exam-questions/" + id),
        (response) => {
          if (response.data.code === constant.code.success) {
            this.setState({ examPaperQuestionData: response.data.data });
          }
        },
        () => {
          this.setState({ currentExPaperId: id, fetching: false });
        }
      );
    } else {
      this.setState({ currentExPaperId: id, fetching: false });
    }
  }

  async getPaperData() {
    const { paperId } = this.props;
    if (paperId === -1) {
      return;
    }
    await request(
      axios.get("/papers/ep/" + paperId),
      (response) => {
        if (response.data.code === constant.code.success) {
          this.setState({ paperData: response.data.data });
        }
      },
      () => {}
    );
  }

  async componentDidMount() {
    await this.getPaperData();
    if (this.state.paperData.ep_list.length > 0) {
      await this.switchExPaper(
        this.state.paperData.ep_list.find(
          (v) => v.ep_state === constant.exam_paper_state.correcting
        ).ep_id
      );
    }
  }

  render() {
    const { menuselect } = this.props;
    const { paperData, examPaperData } = this.state;
    return (
      <div className="correct-paper">
        <Typography>
          <Title>
            批改试卷{" "}
            <span style={{ textDecoration: "underline" }}>
              {paperData.pa_name}
            </span>
          </Title>
        </Typography>
      </div>
    );
  }
}

export default CorrectPaper;
