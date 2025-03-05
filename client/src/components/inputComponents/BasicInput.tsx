import React, { useState } from "react";
import { IoAlert } from "react-icons/io5";

interface BasicInputProps {
  title: string,
  type: string
  value?: string | number,
  insideText?: {
    frontPlace: boolean,
    text: string
  },
  required: boolean,
  error?: any,
  placeholder?: string
}

const BasicInput: React.FC<BasicInputProps> = ({ title, type, value, insideText, required, placeholder, error, ...rest }) => {
  const [hidden, setHidden] = useState<boolean>(true);

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  return (
    <div className="ai-input-block ai-input-block-text">
      <div className="ai-input-label">{title}</div>
      {insideText && insideText.frontPlace && (
        <div className="ai-inside-text">{insideText.text}</div>
      )}
      <input className="ai-input" type={type} defaultValue={value ? value : ''} placeholder={placeholder && placeholder} {...rest}></input>
      {insideText && !insideText.frontPlace && (
        <div className="ai-inside-text">{insideText.text}</div>
      )}
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

export default BasicInput;