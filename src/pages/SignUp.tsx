import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const SignUp = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [fullNameRegister, setFullNameRegister] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };
    
    const handleRegister = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            toast.warn('Please enter a valid email address! ex.test@gmail.com');
        }
        else if (username === "" || password === "" || fullNameRegister === "") {
            toast.warn('Please fill all field!');
        }
        else if (emailRegex.test(username) && (password !== "" || fullNameRegister !== "")) {
            const newUser = { username, password, fullNameRegister };
            localStorage.setItem(username, JSON.stringify(newUser));
            toast.success('Successfully created user!');
            setUsername("")
            setPassword("")
            setFullNameRegister("")
        }
    };
    const buttonStyle = 'flex-center w-full py-[10px] text-[14px] bg-[#39aaff] rounded-full z-[20]';
    const quickSignCardStyle = 'flex flex-col w-[265px] min-h-[200px] mmd:min-h-[425px] px-[28px] py-[22px] rounded-[30px] rounded-bl-[2px] bg-[#ffffff] hover:shadow-[0_4px_32px_rgba(178,167,209,0.5)] transition-all ease-in-out duration-500';

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
            <div className={`${quickSignCardStyle} mt-[30px] mmd:mt-0 mmd:ml-[30px]`}>
                <h4 className="text-purple text-center">Sign up</h4>
                <div className="mt-[65px]">
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
                <div className="mt-[12px]">
                    <input className="loginInput" type="text" placeholder="Name" value={fullNameRegister}
                        onChange={(e) => setFullNameRegister(e.target.value)} />
                </div>
                <div className="w-full max-w-[180px] mx-auto mt-[38px]">
                    <button className={`${buttonStyle} mt-[10px]`} onClick={handleRegister}> Sign up </button>
                </div>
            </div>

        </>

    );
};

export default SignUp;