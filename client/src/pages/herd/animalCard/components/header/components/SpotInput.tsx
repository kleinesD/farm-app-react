import React, { useState } from "react";
import usePPDCall from "../../../../../../hooks/api/usePPDCall";
import { MapPin, CaretDown, CaretUp } from "@phosphor-icons/react";

interface SpotInputProps {
  animal: any
}

const SpotInput: React.FC<SpotInputProps> = ({ animal }) => {
  const {mutate} = usePPDCall({type: 'patch', url: `/api/animals/animal/edit/${animal._id}`})

  const valueChange = (event: React.FormEvent<HTMLDivElement>) => {
    const target = event.currentTarget as HTMLElement;

    if(!target) return;

    const value = target.textContent || '';

    if(!value) return;

    mutate({spot: value})
  }

  if (!animal) return;
  return (
    <div className="aih-ai-item">
      <MapPin size={16} color="#0a0a0a" weight="bold" data-qt="Корпус"/>
      <div className="aih-ai-item-text" contentEditable="true" onInput={valueChange}>{animal.spot ? animal.spot : 'Место'}</div>
      <div className="invis-div"></div>

    </div>
  )
}
export default SpotInput;