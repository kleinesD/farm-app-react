import React from "react";
import moment from "moment";
import { WarningCircle } from "@phosphor-icons/react";
import usePPDCall from "../../../../hooks/api/usePPDCall";
import { useNavigate } from "react-router-dom";

interface WriteOffDisProps {
  animal: any
}

const WriteOffDis: React.FC<WriteOffDisProps> = ({ animal }) => {

  const navigate = useNavigate();

  const url = `/api/animals/bring-back-animal/${animal?._id}`;
  const type = 'patch';
  const { mutate } = usePPDCall({ type, url });

  const bringBackAnimal = () => {
    mutate(null, {
      onSuccess: () => {
        navigate(0);
      }
    });
  }

  return (
    <div className="animal-write-off-disclaimer">
      <div className="animal-write-off-disclaimer-inner">
        <WarningCircle size={40} color="#d44d5c" weight="fill" />

        <div className="awo-title">Животное было списано!</div>
        <div className="awo-date">{moment(animal?.writeOffDate).locale('ru').format('DD MMMM, YYYY')}</div>
        <div className="awo-btn" onClick={bringBackAnimal}>Вернуть</div>
      </div>
    </div>
  )
}

export default WriteOffDis;