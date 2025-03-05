import React from "react";
import { Link } from "react-router-dom";

interface Item {
  link: string,
  text: string,
  date: string
}

interface InsideHistoryProps {
  items: Item[]
}

const InsideHistory: React.FC<InsideHistoryProps> = ({items}) => {
  return (
    <div className="ar-history-block">
      <div className="ar-h-title">ИСТОРИЯ</div>
      <div className="ar-h-container">
        {items.map((item, inx) => (
          <Link className="ar-h-item" key={inx} to={item.link}>
            <p>{item.text}</p>
            <p>{item.date}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default InsideHistory;