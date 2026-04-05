import { Button, Form, Input, Typography } from "antd";
import { usuarioService } from "../../services/usuarioService";
//nao completo
function Login() {
  const onFinish = async (values: { email: string; senha: string }) => {
    alert(values);
    const data = await usuarioService.login(values.email, values.senha);
    alert(JSON.stringify(data));
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Acervo de Livros
      </Typography.Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", required: true, message: "Informe o email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="senha"
          rules={[
            { max: 15, min: 4, required: true, message: "Informe a senha" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
