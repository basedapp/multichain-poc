import { LoginProps } from "@/utils/types";
import Google from "./auth/Google";

const Login = ({ token, setToken }: LoginProps) => {
  return (
    <div className="login-page">
      <div
        className={`max-w-[100%] grid grid-cols-3 grid-flow-row auto-rows-fr gap-5 p-4 mt-8`}
      >
        <Google token={token} setToken={setToken} />
      </div>
    </div>
  );
};

export default Login;
