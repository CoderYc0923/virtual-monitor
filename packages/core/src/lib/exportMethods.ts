import { validateMethods } from "../utils";
import { handleSendError } from "./error";

//主动触发error事件上报
export function traceError(options = {}, flush = false) {
  console.log("traceError", options);
  if (!validateMethods("traceError")) return;
  return handleSendError(options, flush);
}
