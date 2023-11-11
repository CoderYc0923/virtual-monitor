//会话控制，用于方便做同一浏览器上访问页面的动作

import { getCookieByName, uuid } from ".";
import { SESSION_KEY, SURVIVIE_MILLI_SECONDS } from "../common";
import { getTimestamp } from "../utils";

//刷新会话存续期
function refreshSession() {
  const id = getCookieByName(SESSION_KEY) || `s_${uuid()}`;
  const expires = new Date(getTimestamp() + SURVIVIE_MILLI_SECONDS);
  document.cookie = `${SESSION_KEY}=${id};path=/;max-age=1800;expires=${expires.toUTCString()}`;
  return id;
}

//获取sessionId
function getSessionId() {
  return getCookieByName(SESSION_KEY) || refreshSession();
}

refreshSession();

export { refreshSession, getSessionId };
