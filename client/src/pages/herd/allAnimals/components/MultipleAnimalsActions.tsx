import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DotsThreeOutline } from "@phosphor-icons/react";

interface MultipleAnimalsActionsProps {
  animals: any[]
}

const MultipleAnimalsActions: React.FC<MultipleAnimalsActionsProps> = ({ animals }) => {
  const [boxVis, setBoxVis] = useState<boolean>(false);
  const [action, setAction] = useState<any>(null);

  const navigate = useNavigate();

  const handleActionSelection = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    setAction({text: target.textContent, link: target.getAttribute('data-link')});
  }

  const handleSubmit = () => {
    if(!action) return;

    navigate(action.link);
  }

  return (
    <div className="al-selected-animal-line">
      <div className="al-sl-text">Веберите действие</div>
      <div className="al-sl-action-selector" onClick={() => setBoxVis(!boxVis)}>
        {action ? <p>{action.text}</p> : <DotsThreeOutline size={20} color="#0a0a0a" weight="fill" />}

        {boxVis &&
          <div className="al-sl-action-list">
            <div className="al-sl-action-item" data-link={`/herd/write-off/?animals=${animals.map((a: any) => a.number).join(',')}`} onClick={handleActionSelection}>Списать животных</div> 
          </div>
        }

      </div>
      <div className="al-sl-btn">
        <ArrowRight size={18} color="#0a0a0a" weight="bold" onClick={handleSubmit}/>
      </div>
    </div>
  )
}

export default MultipleAnimalsActions;