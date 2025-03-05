import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItemsBoxProps {
  block: 'herd' | 'vet' | 'dist' | 'feed' | 'farm';
}

const MenuItemsBox: React.FC<MenuItemsBoxProps> = ({ block }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    setVisible(false);
  }, [location]);
  
  if (block === 'herd') return (
    <div className="menu-item-box">
      <div className="menu-item-title">
        <Link to={`/herd`} className="mit-text">ЖИВОТНЫЕ</Link>
        <div className="mit-btn" onClick={() => setVisible(!visible)}>...</div>
      </div>

      {visible &&
        <React.Fragment>
          <Link to={'/herd/animals/list/?filter=all'} className="menu-item-link">ВСЕ ЖИВОТНЫЕ</Link>
          <Link to={'/herd/animal/add'} className="menu-item-link">ДОБАВИТЬ ЖИВОТНОЕ</Link>
          <Link to={'/herd/list/milking'} className="menu-item-link">ДОБАВИТЬ РЕЗУЛЬТАТЫ ДОЕНИЯ</Link>
          <Link to={'/herd/write-off'} className="menu-item-link">СПИСАТЬ ЖИВОТНЫХ</Link>
          <Link to={'/herd/history'} className="menu-item-link">ИСТОРИЯ ДАННЫХ</Link>
        </React.Fragment>
      }

    </div>
  )


  return null;
}

export default MenuItemsBox;