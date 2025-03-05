import React, { useState, useEffect, useRef } from "react";
import { X } from '@phosphor-icons/react'

interface Option {
  title: string,
  value: string,
  inputValue?: string | number,
  gender?: 'female' | 'male'
}

interface AnimalSelectProps {
  onChange: (output: Option[]) => void,
  error?: string,
  options: Option[],
  withInput?: boolean
}

const AnimalSelect: React.FC<AnimalSelectProps> = ({ withInput = false, onChange, error, options }) => {
  const [outputOptions, setOutputOptions] = useState<Option[]>([]);
  const prevOptionsRef = useRef<any[] | undefined>(undefined);
  // Update selectedOptions only when the parent-provided value changes

  useEffect(() => {
    if (JSON.stringify(options) !== JSON.stringify(prevOptionsRef.current)) {
      setOutputOptions(options)
      prevOptionsRef.current = options;
    }
  }, [options]);

  const handleDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget?.parentElement?.getAttribute('data-value');
    if (!id) return;
    setOutputOptions(outputOptions.filter((option: any) => option.value !== id));

  }


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const parentId = event.target.parentElement?.parentElement?.getAttribute('data-value');
    if(!inputValue || inputValue.length === 0 || !parentId) return;

    setOutputOptions(outputOptions.map((option: any) => {
      if(option.value === parentId) option.inputValue = parseFloat(inputValue);
      return option;
    }));

  }

  useEffect(() => {
    onChange(outputOptions);

    if(outputOptions.length === 0) prevOptionsRef.current = undefined;
  }, [outputOptions]);


  return (
    <div className="ai-input-block-list" style={{display: `${outputOptions.length > 0 ? 'flex' : 'none'}`}}>
      <div className="ai-input-label">Выбранные животные</div>

      {outputOptions.map((option: any, index: number) => (
        <div key={index} className="ai-input-block ai-input-block-small-select ai-input-block-marginles" data-value={option.value}>
          <div className={`ai-input-alone-text ai-input-alone-text-${option.gender}`}>{option.title}</div>

          {withInput &&
            <div className="ai-input-text-wraper">
              <input type="number" className="ai-input ai-input-text ai-input-small-select" onChange={handleChange}></input>
              <div className="ai-inside-text">₽</div>
            </div>
          }

          <div className="ai-input-delete-big" onClick={handleDelete}>
            <X size={16} color="#0a0a0a" />
          </div>
        </div>

      ))}

    </div>
  )
}

export default AnimalSelect;