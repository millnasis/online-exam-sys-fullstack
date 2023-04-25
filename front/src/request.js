import { notification } from "antd";
import constant from "./constant";

/**
 *
 * @param {Promise} request
 * @param {Function} success
 * @param {Function} final
 */
export default async function request(request, success, final) {
  try {
    const response = await request;
    if (response.status === 200) {
      const { data, msg, code } = response.data;
      if (code === constant.code.error) {
        notification.error({
          message: "错误",
          description:
            typeof msg === "object" ? "系统错误，请查看后台日志" : msg,
        });
        console.log(data);
      } else {
        success(response);
      }
    } else {
      notification.error({
        message: "错误代码" + response.status,
        description: JSON.stringify(response.data),
      });
    }
  } catch (error) {
    console.error(error);
    notification.error({ description: "错误，未找到服务器" });
  } finally {
    final();
  }
}
