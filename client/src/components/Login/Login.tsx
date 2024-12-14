import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import { Eye, EyeOff, CircleAlert } from "lucide-react";
import { LoginRequest, login } from "@/services/users.service";
import { UserContext } from "@/context/UserContext";
import { getCurrentUser } from "@/services/users.service";
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userLogin, setUserLogin] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [loginFailed, setLoginFailed] = useState<boolean>(false);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("YourComponent must be used within a Provider");
  }

  const { user, setUser } = userContext;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const changeUserLogin = (e: ChangeEvent<HTMLInputElement>) => {
    setUserLogin((prevUserLogin) => {
      return {
        ...prevUserLogin,
        [e.target.name]: e.target.value,
      };
    });
  };

  const loginUser = async () => {
    try {
      await login(userLogin.username, userLogin.password);
      const userDetails = await getCurrentUser();
      setUser(userDetails);
      navigate("/");
    } catch (err: unknown) {
      console.log(err);
      setLoginFailed(true);
    }
  };
  return (
    <div className="flex flex-col gap-8 items-center justify-center py-24">
      <h1 className="text-3xl font-bold">Login To Your Account</h1>
      {loginFailed && (
        <div className="bg-red-200 w-2/3 md:w-1/3 lg:w-1/4 px-4 py-4 flex items-center gap-4 ">
          <CircleAlert className="flex-shrink-0" />
          <h1 className="text-sm font-bold">
            There was a problem logging in. Check your username and password or
            create an account.
          </h1>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full items-center">
        <input
          type="text"
          onChange={changeUserLogin}
          className="border border-black w-2/3 md:w-1/3 lg:w-1/4 h-12 px-2 py-2"
          placeholder="Username"
          name="username"
        ></input>
        <div className="relative w-2/3 md:w-1/3 lg:w-1/4">
          <input
            type={showPassword ? "text" : "password"}
            onChange={changeUserLogin}
            className="border border-black w-full h-12 px-2 py-2 pr-10"
            placeholder="Password"
            name="password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <Button
          className="w-2/3 md:w-1/3 lg:w-1/4 py-6 text-lg bg-green-600 hover:bg-green-700"
          onClick={loginUser}
        >
          Log in
        </Button>
      </div>

      <p>
        Dont Have an Account?{" "}
        <Link to="/register" className="underline text-green-500">
          Sign Up Here
        </Link>
      </p>
    </div>
  );
};

export default Login;
