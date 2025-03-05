import React from "react";

interface CombinedBlockProps {
  title: string,
  children: React.ReactNode
}

const CombinedBlock: React.FC<CombinedBlockProps> = ({ title, children }) => {

  return (
    <div className="ai-combined-block">
      <div className="ai-combined-block-title">{title.toUpperCase()}</div>
      {children}
    </div>
  )
}

export default CombinedBlock;