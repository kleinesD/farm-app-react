import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import checkAuth from "../../utils/useCheckAuth";

const MainPage: React.FC = () => {
  const user = useSelector((state: any) => state.user.data);

  const show = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.add('ws-module-block-active');
  };
  const hide = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('ws-module-block-active');
  };

  const visLinks = (event: React.MouseEvent<HTMLDivElement>) => {
    
  }

  return (
    <div className="welcome-section">
      <div className="ws-header">
        <img src={`${process.env.PUBLIC_URL}/img/images/user-default.png`}/>
        <div className="ws-header-text">{user?.firstName} {user?.lastName}</div>
        <div className="ws-header-text ws-header-text-full">{user?.farm?.name}</div>
      </div>

      <div className="ws-module-block ws-module-block-herd" onMouseEnter={show} onMouseLeave={hide}>
        <div className="ws-module-inner">
          <img className="ws-icon" src={`${process.env.PUBLIC_URL}/img/svgs/barn.svg`}/>
          <div className="ws-title">ЖИВОТНЫЕ</div>

          <Link to={'/herd'} className="ws-link">ГЛАВНАЯ</Link>
          <Link to={'/herd/animals/list/?filter=all'} className="ws-link">ВСЕ ЖИВОТНЫЕ</Link>
          <Link to={'/herd/animal/add'} className="ws-link">ДОБАВИТЬ ЖИВОТНОЕ</Link>
          <Link to={'/herd/list/milking'} className="ws-link">ДОБАВИТЬ РЕЗУЛЬТАТЫ ДОЕНИЯ</Link>
          <Link to={'/herd/write-off'} className="ws-link">СПИСАТЬ ЖИВОТНЫХ</Link>
          <Link to={'/herd/history'} className="ws-link">ИСТОРИЯ ДАННЫХ</Link>
        </div>

        <div className="mw-marquee-container">
          <div className="mw-marquee-text mw-marquee-small">УЧЕТ СТАДА | МОЛОЧНАЯ И ВЕСОВАЯ СТАТИСТИКА | ОСЕМЕНЕНИЯ И ОТЕЛЫ | </div>
          <div className="mw-marquee-text mw-marquee-small">УЧЕТ СТАДА | МОЛОЧНАЯ И ВЕСОВАЯ СТАТИСТИКА | ОСЕМЕНЕНИЯ И ОТЕЛЫ | </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage;