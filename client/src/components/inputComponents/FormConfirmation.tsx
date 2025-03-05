import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";


const FormConfirmation: React.FC = () => {
  return (
    <div className="ai-success-block">
      <IoCheckmarkCircle style={{fontSize: '100px', color: 'red'}}/>
    </div>
  );
}

export default FormConfirmation