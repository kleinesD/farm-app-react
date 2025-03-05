import React from "react";
import InsideHistory from "./InsideHistory";

interface Item {
  link: string,
  text: string,
  date: string
}

interface FormSectionProps {
  children: React.ReactNode,
  title: string,
  toEdit: boolean,
  animal?: any,
  onSubmit?: () => void,
  history?: Item[],
}

const FormSection: React.FC<FormSectionProps> = ({children, title, toEdit, animal, onSubmit, history}) => {


  return (
   <div className="animal-results-window">
    <form onSubmit={onSubmit} className="ai-form-container">
      {history && history.length > 0 && (
        <InsideHistory items={history}></InsideHistory>
      )}

      <div className="ai-block-sub-title">{`${!toEdit ? 'ДОБАВИТЬ' : 'РЕДАКТИРОВАТЬ'}`}</div>
      <div className="ai-block-title">{title}</div>

      {children}
    </form>
   </div>
  )
}

export default FormSection; 