import React from 'react';
import { Link } from 'react-router-dom';
import { List, Cow, Drop, Knife, Plus, Clock, ClipboardText } from '@phosphor-icons/react';

const Header: React.FC = () => {

  return (
    <div className="main-page-header">
      <div className='main-page-header-title'>ЖИВОТНЫЕ</div>
      <div className='mph-actions-line'>
        <Link to='/herd/animals/list/?filter=all' className='mph-action-btn' data-qt="Список животных">
          <Cow size={20} color="#0a0a0a" weight="bold" />
        </Link>
        <Link to='/herd/list/milking' className='mph-action-btn' data-qt="Добавить результаты доения">
          <Drop size={20} color="#0a0a0a" weight="bold" />
        </Link>
        <Link to='/herd/write-off' className='mph-action-btn' data-qt="Списать животных">
          <Knife size={20} color="#0a0a0a" weight="bold" />
        </Link>
        <Link to='/herd/animal/add' className='mph-action-btn' data-qt="Добавить животное">
          <Plus size={20} color="#0a0a0a" weight="bold" />
        </Link>
        <Link to='/herd/history' className='mph-action-btn' data-qt="История данных">
          <Clock size={20} color="#0a0a0a" weight="bold" />
        </Link>
        {/* <Link to='/reports' className='mph-action-btn' data-qt="Отчеты">
          <ClipboardText size={20} color="#0a0a0a" weight="bold" />
        </Link> */}
      </div>
    </div>
  )
};

export default Header;