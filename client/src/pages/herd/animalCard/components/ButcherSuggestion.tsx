import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { ExclamationMark } from "@phosphor-icons/react";

interface ButcherSuggestionProps {
  animal: any
}

const ButcherSuggestion: React.FC<ButcherSuggestionProps> = ({ animal }) => {

  return (
    <div className="ac-suggestion-block">
      <div className="ac-sb-icon">
        <ExclamationMark size={20} color="#0a0a0a" weight="bold" />
      </div>

      {animal?.butcherSuggestionReason === 'age' && 
        <div className="ac-sb-text">
          <span>Рекомендация по списанию: </span>
          Животное достигло рекомендуемого возраста списания
        </div>
      }
      {animal?.butcherSuggestionReason === 'weight' && 
        <div className="ac-sb-text">
          <span>Рекомендация по списанию: </span>
          Животное достигло рекомендуемого веса списания
        </div>
      }
      {animal?.butcherSuggestionReason === 'insemination' && 
        <div className="ac-sb-text">
          <span>Рекомендация по списанию: </span>
          Животное плохо осеменяется
        </div>
      }
      <Link className="ac-sb-btn" to={`/herd/write-off`}>Списать животное</Link>
    </div>
  )
}

export default ButcherSuggestion;