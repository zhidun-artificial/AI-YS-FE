// import { useLocation } from "@umijs/max";
import React, { useEffect } from "react";
import { useModel, useNavigate } from "umi";
import { parse } from "query-string";
import { Alert, message } from "antd";
import { getToken } from "@/services/auth/token";
import { CAS_REDIRECT_URL, STORE_KEY_TOKEN, STORE_KEY_USER_ID, STORE_KEY_USER_NAME, STORE_KEY_USER_ROLE } from "@/constants";


const DocxPreview: React.FC = () => {
  const [authSuccess, setAuthSuccess] = React.useState(false);
  const { setUser } = useModel('user');
  const [messageApi, messageCtxHolder] = message.useMessage();
  const navigation = useNavigate();
  const [hasTicket, setHasTicket] = React.useState(false);
  const query = parse(location.search);
  const ticket = decodeURIComponent(query.ticket as string || '');

  useEffect(() => {

    if (!ticket) return

    setHasTicket(true)

    const validate = async () => {
      const res = await getToken({ ticket, service: `${CAS_REDIRECT_URL}` });
      if (res instanceof Error) {
        messageApi.error(res.message)
        return
      }

      if (res.code !== 0) {
        messageApi.error(res.msg)
        return
      }
      const { detail, token } = res.data;

      setUser({
        name: detail.userName,
        id: detail.userId,
        roleId: detail.permit
      })

      localStorage.setItem(STORE_KEY_TOKEN, token);
      localStorage.setItem(STORE_KEY_USER_NAME, detail.userName);
      localStorage.setItem(STORE_KEY_USER_ID, `${detail.userId}`);
      localStorage.setItem(STORE_KEY_USER_ROLE, `${detail.permit}`);

      setAuthSuccess(true)
      window.history.replaceState({}, document.title, window.location.pathname);
      messageApi.success(`${res.data.detail.userName}，欢迎回来！`)
      setTimeout(() => {
        navigation('/home')
      }, 1500)
    }

    validate();

  }, [ticket])


  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {messageCtxHolder}
      {hasTicket ?
        authSuccess ?
          <Alert message={'校验成功，跳转中...'} type="success"></Alert>
          :
          <Alert message={'信息校验中...'} type="info"></Alert>
        :
        <Alert message={'未获取到有效ticket'} type="error"></Alert>
      }
    </div>
  );
}

export default DocxPreview;