import React, { useEffect, useState } from "react";
import { IoCheckmark, IoAlert } from "react-icons/io5";
import { PiCheckFatFill } from "react-icons/pi";
import { CheckFat } from '@phosphor-icons/react'



interface RadioButtonProps {
  title: string,
  required: boolean,
  error?: string,
  defaultPicked?: boolean,
  onClick: (clicked: boolean) => void
}

const RadioButton: React.FC<RadioButtonProps> = ({ title, required, error, defaultPicked, onClick }) => {
  const [clickState, setClickState] = useState<boolean>(defaultPicked || false);
  const [hidden, setHidden] = useState<boolean>(true);

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  const handleRadioClick = () => {
    const result = !clickState;

    setClickState(result);
  }
  
  useEffect(() => {
    onClick(clickState);
  }, [clickState]);

  return (
    <div className="ai-input-block ai-radio-block">
      <div className="ai-radio" onClick={handleRadioClick}>
        {clickState &&
          <div className="ai-radio-inner">
            <CheckFat size={18} color="#f0f0f0" weight="fill" />
          </div>
        }
      </div>
      <div className="ai-radio-text">{title}</div>

      {required && (
        <div className="ai-input-marker ai-input-marker-r" onMouseEnter={toggleHidden} onMouseLeave={toggleHidden}>
          <IoAlert />
        </div>
      )}
      {required && (
        <div style={{ opacity: `${hidden ? 0 : 1}` }} className="ai-input-explain-block ai-input-explain-block-required">
          <div className="ai-input-eb-tri"></div>
          <div className="ai-input-eb-text">Обязательно</div>
        </div>
      )}
      {error && <div className="ai-warning-text">{error}</div>}
    </div>
  )
}

export default RadioButton;