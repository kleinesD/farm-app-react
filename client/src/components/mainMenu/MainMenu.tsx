import React, { useEffect, useState } from "react";
import { X, DotsThreeOutlineVertical, ArrowLeft, SignOut } from '@phosphor-icons/react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import useLogout from "../../hooks/auth/useLogout";
import { useSelector } from "react-redux";
import MenuItemsBox from "./components/MenuLinksBox";

const MainMenu: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setVisible(false);
  }, [location]);

  const user = useSelector((state: any) => state.user.data);

  
  const { mutate } = useLogout();
  
  const logout = () => {
    mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      }
    })
  }
  
  if (!user) return null;
  
  return (
    <React.Fragment>
      {window.history.length > 1 &&
        <div className="main-menu-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} color="#f0f0f0" weight="bold" />
        </div>
      }

      <div className="main-menu-btn" onClick={() => setVisible(!visible)}>
        {!visible ?
          <DotsThreeOutlineVertical size={20} color="#f0f0f0" weight="fill" />
          :
          <X size={20} color="#f0f0f0" weight="bold" />
        }
      </div>

      {visible &&
        <div className="main-menu">
          <div className="main-menu-logout-btn" onClick={logout}>
            <SignOut size={20} color="#f0f0f0" weight="bold" />
          </div>

          <div className="main-menu-header">
            <Link to="/" className="menu-logo-box">
              <img className="menu-logo" src={`${process.env.PUBLIC_URL}/img/logos/farmme-logo-6.png`} />
            </Link>

            <div className="header-user-block">
              <div className="header-user-link">
                <div className="header-user-info">
                  <div className="huf-name">{user.firstName} {user.lastName}</div>
                  <div className="huf-title">Босс</div>
                </div>

                <img src={`${process.env.PUBLIC_URL}/img/images/user-default.png`} />
              </div>
            </div>
          </div>

          <div className="main-menu-items-container">
            <MenuItemsBox block="herd"></MenuItemsBox>
          </div>

        </div>
      }
    </React.Fragment>
  )
}

export default MainMenu;