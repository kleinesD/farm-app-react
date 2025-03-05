import React from "react";

interface SubmitButtonProps {
  id?: string,
  index?: number,
  isLoading: boolean,
  isFinished: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ id, index, isLoading = false, isFinished = false }) => {
  return (
    <button type="submit" className="ai-input-submit-btn" data-id={id ? id : ''} data-index={index ? index : ''} style={isLoading ? {width: '60px', borderRadius: '50%'} : {}}>
      {!isLoading ? 'Сохранить' :<div className="mini-loader"></div>}
      </button>
  )
}

export default SubmitButton;