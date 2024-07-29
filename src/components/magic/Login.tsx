
import Google from "./auth/Google";

const Login = () => {
  return (
    <div className="login-page">
      <div
        className={`max-w-[100%] grid grid-cols-3 grid-flow-row auto-rows-fr gap-5 p-4 mt-8`}
      >
        <Google />
      </div>
    </div>
  );
};

export default Login;
