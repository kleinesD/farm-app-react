import React, { useState } from "react";
import usePPDCall from "../../../../../../hooks/api/usePPDCall";
import { useSelector } from "react-redux";
import { Garage, CaretDown, CaretUp } from "@phosphor-icons/react";

interface BuildingInputProps {
  animal: any
}

const BuildingInput: React.FC<BuildingInputProps> = ({ animal }) => {
  const [selectVis, setSelectVis] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>(animal.building || 'Корпус');

  const farm = useSelector((state: any) => state.user.data.farm);

  const handleClick = () => {
    if (farm.animalCategories.length > 0) {
      setSelectVis(!selectVis);
    } else {
      // link to edit farm page
    }
  }

  const {mutate} = usePPDCall({type: 'patch', url: `/api/animals/animal/edit/${animal._id}`})

  const valueChange = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if(!target) return;

    const value = target.getAttribute('data-value');

    if(!value) return;

    mutate({building: value}, {
      onSuccess: () => {
        setSelectVis(false);
        setCurrentValue(value);
      }
    })
  }

  if (!animal || !farm) return;
  return (
    <div className="aih-ai-item" onClick={handleClick}>
      <Garage size={16} color="#0a0a0a" weight="bold" data-qt="Корпус"/>
      <p className="aih-ai-item-text">{currentValue}</p>

      {farm.buildings.length > 0 && (
        <React.Fragment>
          {!selectVis ?
            <CaretDown size={14} color="#0a0a0a" weight="bold" />
            :
            <CaretUp size={14} color="#0a0a0a" weight="bold" />
          }
        </React.Fragment>
      )}

      {(farm.buildings.length > 0 && selectVis) &&
        <div className="aih-ai-select-block">
          {farm.buildings.map((build: any, index: any) => (
            <div key={index} className="aih-ai-select-item" data-value={build} onClick={valueChange}>
              <p>{build}</p>
            </div>
          ))}
        </div>
      }

    </div>
  )
}
export default BuildingInput;