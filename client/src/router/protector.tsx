import React, { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectorProps {
  children: React.ReactNode,
  block?: string,
  toAdd?: boolean,
  toEdit?: boolean
}

const RouteProtector: React.FC<ProtectorProps> = ({ children, block, toAdd, toEdit }): any => {
  const user = useSelector((state: any) => state.user.data);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      if (block && !user.accessBlocks.includes(block)) {
        navigate('/');
      }

      if (toAdd && !user.editData) {
        console.log('You are not allowed to add or edit any data!');
      }

      if (toEdit && !user.editOther) {
        console.log('You are not allowed to edit other people data!');
      }
    }

  }, [user]);

  return <>{children}</>
}

export default RouteProtector;