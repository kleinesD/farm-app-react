import React, { useState } from "react";
import useLogin from "../../hooks/auth/useLogin";
import { UseSelector, useSelector } from "react-redux";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";



const Login: React.FC = () => {
  const user = useSelector((state: any) => state.user.data);

  const [passVis, setPassVis] = useState<boolean>(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const changePassVis = () => {
    setPassVis(!passVis);
  }

  const navigate = useNavigate();

  const { mutate, isError, error, isSuccess } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password }, {
      onSuccess: () => {
        navigate('/');
      }
    });
  }

  return (
    <section className="form-section">
      <form className="common-form" onSubmit={handleLogin}>
        <img className="form-icon" src={`${process.env.PUBLIC_URL}/img/logos/farmme-logo-5.png`}></img>

        <div className="input-box">
          <input className="common-form-input" type="email" placeholder="Электронная почта" onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="input-box">
          <input className="common-form-input" type={!passVis ? 'password' : 'text'} placeholder="Пароль" onChange={(e) => setPassword(e.target.value)}></input>
          <div className="pass-visibility-btn" onClick={changePassVis}>
            {!passVis ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </div>
        </div>

        <button type="submit" className="common-form-btn">Войти</button>
      </form>
    </section>
  )
}

export default Login;