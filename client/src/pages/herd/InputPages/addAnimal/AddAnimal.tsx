import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MainSection from '../../../../components/MainSection';


const AddAnimal = () => {
  const navigate = useNavigate();

  return (
    <MainSection block='herd'>
        <div className="ai-decide-block">
          <div id="birth" className="ai-decide-block-item" onClick={() => navigate('/herd/animal/add/alive')}>
            <div className="ai-decide-block-item-text">
              ДОБАВИТЬ
              <span> ЖИВОТНОЕ</span>
            </div>
            <img className="ai-decide-block-item-img" src={`${process.env.PUBLIC_URL}/img/icons/herd-calf.png`}></img>
          </div>
          
          <div id="dead" className="ai-decide-block-item" onClick={() => navigate('/herd/animal/add/dead')}>
            <div className="ai-decide-block-item-text">
              ДОБАВИТЬ МЕРТВОРОЖДЕНИЕ
            </div>
            <img className="ai-decide-block-item-img" src={`${process.env.PUBLIC_URL}/img/icons/dead-birth.png`}></img>
          </div>
        </div>

  
    </MainSection>
  )
}

export default AddAnimal;