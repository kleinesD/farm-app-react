import React from "react";

interface SlaughterSuggestionProps {
  farm: any
}

const SlaughterSuggestion: React.FC<SlaughterSuggestionProps> = ({ farm }) => {

  return (
    <div className="al-suggestion-block">
      <div className="al-sb-line">
        <div className="al-sb-line-text">
          Причина для списания
          <span className="al-sb-line-text-female"> коров </span>
          :
        </div>
        <div className="al-sb-item">
          <p>Возраст:</p>
          <span>{farm.butcherAge.female} мес.</span>
        </div>
        <div className="al-sb-item">
          <p>Вес:</p>
          <span>{farm.butcherWeight.female} кг.</span>
        </div>
      </div>

      <div className="al-sb-line">
        <div className="al-sb-line-text">
          Причина для списания
          <span className="al-sb-line-text-male"> быков </span>
          :
        </div>
        <div className="al-sb-item">
          <p>Возраст:</p>
          <span>{farm.butcherAge.male} мес.</span>
        </div>
        <div className="al-sb-item">
          <p>Вес:</p>
          <span>{farm.butcherWeight.male} кг.</span>
        </div>
      </div>
    </div>
  )
}

export default SlaughterSuggestion;