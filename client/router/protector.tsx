import React from "react";
import { Navigate, replace, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectorProps {
  children: React.ReactNode,
  block?: string,
  toAdd?: boolean,
  toEdit?: boolean
}

const RouteProtector: React.FC<ProtectorProps> = ({ children, block, toAdd, toEdit }): any => {
  const user = useSelector((state: any) => state.user.data);
  const location = useLocation;

  if (!user) {
    //return <Navigate to="/login" replace state={{ from: location }} />
    return console.log('You are not logged in!');
  }
  
  if(block && !user.accessBlocks.includes(block)) {
    return console.log('You are not allowed to this section!');
  }
  
  if(toAdd && !user.editData) {
    return console.log('You are not allowed to add or edit any data!');
  }
  
  if(toEdit && !user.editOther) {
    return console.log('You are not allowed to edit other people data!');
  }

  return <>{children}</>
}

export default RouteProtector;