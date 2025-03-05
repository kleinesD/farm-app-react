import React, { useState, useEffect, useRef } from "react";
import { IoAlert } from "react-icons/io5";

interface Option {
  title: string,
  value: string,
  restricted?: boolean,
  nonSelect?: boolean
}

interface PickerProps {
  options: Option[],
  multiSelect?: boolean,
  title: string,
  error?: string,
  required: boolean,
  onPick: (picked: string[]) => void,
  value?: string[]
}

const Picker: React.FC<PickerProps> = ({ options, multiSelect = false, title, error, required, onPick, value }) => {
  const [pickedOptions, setPickedOptions] = useState<string[]>([]);
  const prevValueRef = useRef<string[] | undefined>(undefined);

  // Update pickedOptions only when the parent-provided value changes
  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(prevValueRef.current)) {
      setPickedOptions(value || []);
      prevValueRef.current = value; // Update the ref to track the latest value
    }
  }, [value]);
  
  
  const [hidden, setHidden] = useState<boolean>(true);
  
  const toggleHidden = () => {
    setHidden(!hidden)
  }
  
  const handlePick = (event: React.MouseEvent<HTMLDivElement>) => {
    const picked = event.currentTarget.getAttribute('data-value');
    if (!picked) return;
    
    setPickedOptions((prev) => {
      let updatedOptions;
      
      if (!prev.includes(picked)) {
        updatedOptions = multiSelect ? [...prev, picked] : [picked];
      } else {
        updatedOptions = prev.filter(option => option !== picked);
      }
      
      /* onPick(updatedOptions); */
      return updatedOptions;
    });
  }
  
  useEffect(() => {
    onPick(pickedOptions);
  }, [pickedOptions]);


  return (
    <div className="ai-input-block ai-input-block-pick">
      <div className="ai-input-label">{title}</div>
      {options.map((option, i) =>
        <div className={`ai-pick ${pickedOptions.includes(option.value) ? 'ai-pick-active' : ''} ${option?.restricted ? 'ai-pick-unav' : ''} ${option?.nonSelect ? 'ai-pick-restricted' : ''}`} key={i} data-value={option.value} onClick={(e) => !option?.nonSelect && handlePick(e)}>{option.title}</div>)}
      {required && (
        <div className="ai-input-marker ai-input-marker-r" onMouseEnter={toggleHidden} onMouseLeave={toggleHidden}>
          <IoAlert />
        </div>
      )}
      {required && (
        <div style={{ opacity: `${hidden ? 0 : 1}` }} className="ai-input-explain-block ai-input-explain-block-required">
          <div className="ai-input-eb-tri"></div>
          <div className="ai-input-eb-text">Обязательно</div>
        </div>
      )}
      {error && <div className="ai-warning-text">{error}</div>}
    </div>
  )
}

export default Picker;