import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Eye, EyeOff, CircleAlert } from "lucide-react";
import { RegisterRequest, register } from "@/services/users.service";
const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userRegister, setUserRegister] = useState<RegisterRequest>({
    username: "",
    password: "",
    email: "",
  });
  const [registerFailed, setRegisterFailed] = useState<boolean>(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const changeUserRegister = (e: ChangeEvent<HTMLInputElement>) => {
    setUserRegister((prevUserRegister) => {
      return {
        ...prevUserRegister,
        [e.target.name]: e.target.value,
      };
    });
  };

  const registerUser = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(
        userRegister.username,
        userRegister.password,
        userRegister.email
      );
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      setRegisterFailed(true);
    }
  };
  return (
    <div className="flex flex-col gap-8 items-center justify-center py-24">
      <h1 className="text-3xl font-bold">Sign Up and Start Learning</h1>
      {registerFailed && (
        <div className="bg-red-200 w-2/3 md:w-1/3 lg:w-1/4 px-4 py-4 flex items-center gap-4 ">
          <CircleAlert className="flex-shrink-0" />
          <h1 className="text-sm font-bold">
            There was a problem signing you up! Check your username, password
            and email.
          </h1>
        </div>
      )}
      <form
        className="flex flex-col gap-4 w-full items-center"
        onSubmit={registerUser}
      >
        <input
          type="text"
          onChange={changeUserRegister}
          className="border border-black w-2/3 md:w-1/3 lg:w-1/4 h-12 px-2 py-2"
          placeholder="Username"
          name="username"
        ></input>
        <input
          type="email"
          onChange={changeUserRegister}
          className="border border-black w-2/3 md:w-1/3 lg:w-1/4 h-12 px-2 py-2"
          placeholder="Email"
          name="email"
        ></input>
        <div className="relative w-2/3 md:w-1/3 lg:w-1/4">
          <input
            type={showPassword ? "text" : "password"}
            onChange={changeUserRegister}
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
        <Button className="w-2/3 md:w-1/3 lg:w-1/4 py-6 text-lg bg-green-600 hover:bg-green-700">
          Sign Up
        </Button>
      </form>

      <p>
        Already Have an Account?{" "}
        <Link to="/login" className="underline text-green-500">
          Log In Here
        </Link>
      </p>
    </div>
  );
};

export default Register;
