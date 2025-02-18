import bigBg from '@/assets/images/big-ai.png';
import logoIcon from '@/assets/images/logo.png';
import { registerUser } from '@/services/auth/register';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';

export default function Page() {
  let navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    const res = await registerUser(values);
    if (res instanceof Error) {
      return;
    }
    if (res.code === 0) {
      message.success('注册成功，3秒后跳转到登录页面');
      setTimeout(() => {
        navigate('../login', { replace: true });
      }, 3000);
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
          AI知识服务系统
        </h1>
        {/* <img src={NameSvg} alt="bigBg" className="w-[287px] h-[46px]" /> */}
      </section>
      <section className="flex justify-center items-center gap-[225px] mx-auto">
        <img src={bigBg} alt="bigBg" className="w-1/3 h-1/3 object-cover" />
        <div className="w-1/2 max-w-[600px] mr-10 p-10 bg-white flex justify-center items-center flex-col rounded-[20px] shadow-xl">
          <h1 className="text-[#000614] text-3xl font-bold tracking-widest mb-4">
            注册账号
          </h1>
          <div className="w-8 h-1 bg-[#0060CE] mb-2 xl:mb-12"></div>
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

            {/* <Form.Item
              label="邮箱"
              name="email"
              className="mb-6 xl:mb-12"
              rules={[{ required: true, message: '请输入邮箱!' }]}
            >
              <Input
                size="large"
                className="h-[52px]"
                prefix={<MailOutlined />}
              />
            </Form.Item> */}

            <Form.Item
              label="密码"
              name="password"
              className="mb-6 xl:mb-12"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                size="large"
                className="h-[52px]"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-[52px]"
                size="large"
              >
                创建账号
              </Button>
            </Form.Item>
          </Form>
          <span className="text-[#666666]">
            已有账号？
            <span
              className="text-[#477FFF] hover:cursor-pointer"
              onClick={() => {
                navigate('../login', { replace: true });
              }}
            >
              去登录
            </span>
          </span>
        </div>
      </section>
    </div>
  );
}
