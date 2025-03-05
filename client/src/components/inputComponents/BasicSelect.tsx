import React, { useState, useRef, useEffect } from "react";
import { IoAlert } from "react-icons/io5";

interface Option {
  title: string,
  value: string,
  subTitle?: string
}

interface BasicSelectProps {
  options: Option[],
  title: string,
  value?: string[],
  placeholder: string,
  onSelect: (selected: string[]) => void,
  error?: string,
  required: boolean,
  multiSelect?: boolean
}

const BasicSelect: React.FC<BasicSelectProps> = ({ options, title, placeholder, value, onSelect, error, required, multiSelect = false }) => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [blockVis, setBlockVis] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState<boolean>(true);


  const prevValueRef = useRef<string[] | undefined>(undefined);
  // Update selectedOptions only when the parent-provided value changes
  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(prevValueRef.current)) {
      setSelectedOption(value || []);
      prevValueRef.current = value; // Update the ref to track the latest value
    }
  }, [value]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);


  const toggleHidden = () => {
    setHidden(!hidden)
  }

  const filterOptions = (inputValue: string): any => {
    const newFilteredOptions = options.filter(option => option.title.toLowerCase().includes(inputValue.toLowerCase()))
    setFilteredOptions(newFilteredOptions)
  }

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the clicked target is outside of the container
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setBlockVis(false); // Hide the block
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks on the document
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, []);

  const handleOptionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const selected = event.currentTarget.getAttribute('data-value')
    if (!selected) return;
    setSelectedOption((prev: any) => prev.includes(selected) ? prev : multiSelect ? [...prev, selected] : [selected]);

    setBlockVis(false);
  }

  useEffect(() => {
    onSelect(selectedOption);

  }, [selectedOption]);


  return (
    <div ref={containerRef} className="ai-input-block ai-input-block-select">
      <div className="ai-input-label">{title}</div>
      <input type="text" className="ai-input ai-input-select" placeholder={placeholder} defaultValue={selectedOption && !multiSelect ? options.find((opt: any) => selectedOption.includes(opt.value))?.title : ''} onClick={() => setBlockVis(!blockVis)} onChange={(e) => filterOptions(e.target.value)}></input>
      <div className="ai-select-block shadow" style={{ display: `${blockVis ? 'block' : 'none'}` }}>
        {filteredOptions.map((option, index) => {
          return (
            <div key={index} className={`ai-select-item ${selectedOption.includes(option?.value) ? 'ai-select-item-selected' : ''}`} data-value={option?.value} onClick={handleOptionClick}>
              <p className="ai-select-name">{option?.title}</p>
              <p className="ai-select-sub-name">{option?.subTitle}</p>
            </div>
          )
        })}
      </div>
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
      {error && !blockVis && <div className="ai-warning-text">{error}</div>}
    </div>
  )
}

export default BasicSelect;
