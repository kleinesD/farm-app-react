import React from 'react';
import usePPDCall from '../../../../hooks/api/usePPDCall';
import moment from 'moment';
import { Syringe, Check, X } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface UnconfirmedInseminationProps {
  animal: any
}

const UnconfirmedInsemination: React.FC<UnconfirmedInseminationProps> = ({ animal }) => {
  const navigate = useNavigate();

  const type = 'patch';
  const url = `/api/animals/insemination/${animal._id}/${animal.inseminations.at(-1)._id}`;
  const {mutate} = usePPDCall({type, url});

  const confirmResult = (event: React.MouseEvent<HTMLDivElement>) => {
    const success = event.currentTarget.getAttribute('data-value');

    if(!success) return;

    mutate({success}, {
      onSuccess: () => {
        navigate(0);
      }
    })
  }

  return (
    <div className='ac-insemination-decide'>
      <div className='ac-id-icon'>
        <Syringe size={20} color="#0a0a0a" weight="bold" />
      </div>

      <div className='ac-id-text'>
        Неподтвержденное осеменение 
        <span>{moment(animal?.inseminations?.at(-1)?.date).format('DD.MM.YYYY')}</span>
      </div>

      <div className='ac-id-btn ac-id-btn-suc' onClick={confirmResult} data-value='true'>
        <Check size={20} color="#0a0a0a" weight="bold" />
        <p>Успешно</p>
      </div>
      <div className='ac-id-btn ac-id-btn-fail' onClick={confirmResult} data-value='false'>
        <X size={20} color="#0a0a0a" weight="bold" />
        <p>Не успешно</p>
      </div>


    </div>
  )
}

export default UnconfirmedInsemination;