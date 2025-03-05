import React, { useState } from "react";
import { IoAlert } from "react-icons/io5";

interface NoteInputProps {
  title: string,
  value?: string,
  required: boolean,
  error?: string,
  placeholder?: string
}

const NoteInput: React.FC<NoteInputProps> = ({ title, value, required = false, error, placeholder, ...rest }) => {
  const [hidden, setHidden] = useState<boolean>(true);

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  return (
    <div className="ai-input-block ai-input-block-text ai-input-block-textarea">
      <div className="ai-input-label">{title}</div>
      <textarea className="ai-textarea" defaultValue={value && value} {...rest}></textarea>
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

export default NoteInput;