import React from "react";

interface EmptyBlockProps {
  title: string,
  text?: string
}

const EmptyBlock: React.FC<EmptyBlockProps> = ({ title, text }) => {
  return (
    <div className="no-info-block">
      <div className="no-info-block-background"></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

export default EmptyBlock;