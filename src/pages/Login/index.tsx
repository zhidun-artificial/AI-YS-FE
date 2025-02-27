import bigBg from '@/assets/images/big-ai.png';
import logoIcon from '@/assets/images/logo.png';
import { STORE_KEY_TOKEN, STORE_KEY_USER_ID, STORE_KEY_USER_NAME, STORE_KEY_USER_ROLE } from '@/constants';
import { login } from '@/services/auth/login';
import { getPermissions } from '@/services/user/role';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useModel, useNavigate } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';

export default function Page() {
  const navigate = useNavigate();
  const { globalInfo } = useModel('global');
  const { setUser } = useModel('user');
  const { initialState, setInitialState } = useModel('@@initialState');

  const onFinish = async (values: { username: string; password: string }) => {
    const res = await login(values);
    if (res instanceof Error) {
      return;
    }
    if (res.code === 0) {
      // 保存token和用户信息
      localStorage.setItem(STORE_KEY_TOKEN, res.data.token);
      localStorage.setItem(STORE_KEY_USER_ID, `${res.data.info.id}`);
      localStorage.setItem(STORE_KEY_USER_NAME, `${res.data.info.name}`);
      localStorage.setItem(STORE_KEY_USER_ROLE, `${res.data.info.roleId}`);
      setUser(res.data.info);
      console.log('login success');
      // TODO: 处理权限获取
      try {
        const authRes = await getPermissions(res.data.info.roleId);
        if (authRes instanceof Error) {
          message.error(authRes.message);
          return;
        }
        if (authRes.code === 0) {
          console.log(authRes.data);
          setInitialState(() => {
            return {
              ...initialState,
              auth: authRes.data,
            };
          });
        }
      }
      catch (e) {
        navigate(`/home`, { replace: true });
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="h-screen bg-[url('@/assets/images/bg.png')] bg-[length:100%_100%]">
      <section className="h-[162px] p-[50px] flex items-center ">
        <img
          src={logoIcon}
          alt="logo"
          className="w-[62px] h-[62px] mr-[20px]"
        />
        <h1 className="text-[#000614] text-[43px] -tracking-[0px]">
          {globalInfo.appName}
        </h1>
      </section>
      <section className="flex justify-center items-center gap-[225px] mx-auto">
        <img src={bigBg} alt="bigBg" className="w-1/3 h-1/3 object-cover" />
        <div className="w-1/2 max-w-[600px] mr-10 p-10 bg-white flex justify-center items-center flex-col rounded-[20px] shadow-xl">
          <h1 className="text-[#000614] text-3xl font-bold tracking-widest mb-4">
            欢迎登录
          </h1>
          <div className="w-8 h-1 bg-[#0060CE] mb-6 xl:mb-12"></div>
          <Form
            className="w-full"
            name="login"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="用户名"
              name="username"
              className="mb-6 xl:mb-12"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                size="large"
                className="h-[52px]"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                size="large"
                className="h-[52px]"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            {/* <span className="text-[#586A92] text-base cursor-pointer block text-right mb-[50px] -mt-2">
              忘记密码 ？
            </span> */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-[52px]"
                size="large"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <span className="text-[#666666]">
            没有账号？
            <span
              className="text-[#477FFF] hover:cursor-pointer"
              onClick={() => {
                // 跳转到注册页面
                navigate('../register', { replace: true });
              }}
            >
              注册
            </span>
          </span>
        </div>
      </section>
    </div>
  );
}
