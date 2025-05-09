import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { House, Cow, ArrowArcLeft, ArrowArcRight, Browsers } from '@phosphor-icons/react';

interface RIghtClickMenuProps {
  block: string
}

const RightClickMenu: React.FC<RIghtClickMenuProps> = ({ block }) => {
  const [rcm, setRcm] = useState<{ x: number, y: number } | null>(null);
  const [additionalLinks, setAdditionalLinks] = useState<any[] | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();

      const target = event.target as HTMLElement;

      const title = target.closest("[data-rcm-title]")?.getAttribute("data-rcm-title");
      const link = target.closest("[data-rcm-link]")?.getAttribute("data-rcm-link");

      if (title && link) setAdditionalLinks([{ link, title }])
      else setAdditionalLinks(null);

      setRcm({ x: event.clientX, y: event.clientY });
    };

    const handleClick = () => {
      setRcm(null);
      setAdditionalLinks(null);
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);
    document.addEventListener("scroll", handleClick);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleClick);
    };
  }, []);


  if (block === 'herd') {
    return (
      <React.Fragment>
        {rcm &&
          <div className='rc-menu' style={{ top: rcm.y, left: rcm.x }}>
            <Link to={`/`} className='rc-menu-item'>
              <House size={14} color="#0a0a0a" weight="fill" />
              <p>Домой</p>
            </Link>
            <Link to={`/herd`} className='rc-menu-item'>
              <Cow size={14} color="#0a0a0a" weight="fill" />
              <p>Домой</p>
            </Link>
            <div className='rc-menu-item' onClick={() => navigate(-1)}>
            <ArrowArcLeft size={14} color="#0a0a0a" weight="fill" />
              <p>Назад</p>
            </div>
            <div className='rc-menu-item' onClick={() => navigate(1)}>
            <ArrowArcRight size={14} color="#0a0a0a" weight="fill" />
              <p>Вперед</p>
            </div>

            {(additionalLinks && additionalLinks.length > 0) &&
              additionalLinks.map((item: any, index) => (
                <Link key={index} to={`${item.link}`} className='rc-menu-item'>
                  <Browsers size={14} color="#0a0a0a" weight="fill" />
                  <p>{item.title}</p>
                </Link>
              ))
            }
          </div>
        }
      </React.Fragment>

    )
  }
}

export default RightClickMenu;