import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="A página que você tentou acessar não existe."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Voltar ao início
        </Button>
      }
    />
  );
}

export default NotFound;
