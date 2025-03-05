import React from "react";
import { Link } from "react-router-dom";

interface FiltersProps {
  filter: string
}

const Filters: React.FC<FiltersProps> = ({ filter }) => {

  return (
    <div className="aa-filter-container">
      <Link className={`aa-filter-item ${filter === 'all' ? 'aa-filter-item-active' : ''}`} to={`/herd/animals/list/?filter=all`}>ВСЕ ЖИВОТНЫЕ</Link>
      <Link className={`aa-filter-item ${filter === 'bulls' ? 'aa-filter-item-active' : ''}`} to={`/herd/animals/list/?filter=bulls`}>БЫКИ</Link>
      <Link className={`aa-filter-item ${filter === 'cows' ? 'aa-filter-item-active' : ''}`} to={`/herd/animals/list/?filter=cows`}>КОРОВЫ</Link>
      <Link className={`aa-filter-item ${filter === 'heifers' ? 'aa-filter-item-active' : ''}`} to={`/herd/animals/list/?filter=heifers`}>ТЕЛКИ</Link>
      {/* <Link className={`aa-filter-item ${filter === 'calves' ? 'aa-filter-item-active' : ''}`} to={`/herd/animals/list/?filter=calves`}>ТЕЛЯТА</Link> */}
      <Link className={`aa-filter-item ${filter === 'diseased' ? 'aa-filter-item-active' : ''}`} to={`/herd/animals/list/?filter=diseased`}>СПИСАННЫЕ</Link>
      <Link className={`aa-filter-item ${filter === 'slaughter' ? 'aa-filter-item-active' : ''}`} to={`/herd/animals/list/?filter=slaughter`}>ЗАБОЙ</Link>
    </div>
  )
}

export default Filters;