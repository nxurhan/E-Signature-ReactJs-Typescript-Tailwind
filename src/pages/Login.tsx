import { useState } from "react";
import CheckedIcon from "../components/svg/Checked";
import { useNavigate } from "react-router-dom";
import myImage from '../assets/background.png';
import LoadingScreen from "@/components/LoadingScreen";
import SignUp from "./SignUp";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loadingScreen, setLoadingScreen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const storedUser = localStorage.getItem(username);
    if (username === "" && password !== "") {
      toast.warn('Please fill email field!');
    }
    else if (password === "" && username !== "") {
      toast.warn('Please fill password field!');
    }
    else if (password === "" && username === "") {
      toast.warn('All fields are required!');
    }
    else if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.password === password) {
        localStorage.setItem("loginUser", JSON.stringify(username));
        toast.success('Successfully logged in');
        setLoadingScreen(true);
        setTimeout(() => {
          setLoadingScreen(false);
          navigate('/Home/ESignature');
        }, 2000);
      }
      else if (parsedUser.password !== password) {
        toast.warn('Wrong Password!');
      }
    }
    else {
      toast.warn('Wrong credentials!');
    }
  };
  const featureList = [
    'Use newly added signatures', 'Create and save signatures'
  ];
  const buttonStyle = 'flex-center w-full py-[10px] text-[14px] bg-[#39aaff] rounded-full z-[20]';
  const cardStyle = 'flex flex-col w-[265px] min-h-[425px] px-[28px] py-[22px] rounded-[30px] rounded-br-[2px] bg-[#ffffff] hover:shadow-[0_4px_32px_rgba(178,167,209,0.5)] transition-all ease-in-out duration-500';
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="absolute left-0 top-0 w-full h-full z-0 ">
        {/* <LoginBackgroundImage /> */}
        <img src={myImage} alt="My Image" className="opacity-60" width="100%" height="100vh"/>
      </div>
      {loadingScreen ? <LoadingScreen /> : <>
        <section className="relative z-[10] flex flex-col mmd:flex-row justify-center items-center m-auto">
          <form className={`${cardStyle}`}>
            <h4 className="text-purple text-center">Log In</h4>
            <ul className="my-[32px] text-[14px]">
              {featureList.map((feature, index) => (
                <li key={index} className="featureList flex items-center">
                  <CheckedIcon />
                  <span className="ml-[9px] text-[#4F4F4F]">{feature}</span>
                </li>
              ))}
            </ul>
            <div>
              <input className="loginInput" type="text" placeholder="Email" value={username}
                onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mt-[12px]">
              <input className="loginInput" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} />
              <label>
                <input
                  className="mt-[10px]"
                  type="checkbox"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                <label className="ml-[5px] text-[12px]">Show Password</label>
              </label>
            </div>
            <div className="w-full max-w-[180px] mx-auto mt-[38px]">
              <button className={`${buttonStyle} mt-[10px]`} onClick={handleLogin}>Log In</button>
            </div>
          </form>
          <SignUp />
        </section>
      </>
      }
    </>

  );
};

export default Login;