import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import useGetAllFarmAnimals from "../../../hooks/useGetAllFarmAnimals";
import MainSection from "../../../components/MainSection";
import { useNavigate } from "react-router-dom";

import { MagnifyingGlass } from "@phosphor-icons/react";
import usePrepareItems from "./hooks/usePrepareItems";
import HistoryItemsContainer from "./components/HistoryItemsContainer";
import Loader from "../../../components/otherComponents/loader/Loader";

const HerdEditHistory: React.FC = () => {
  const [filters, setFilters] = useState<string[]>(['milking', 'weight', 'lactation', 'addition', 'write-off']);
  const [animals, setAnimals] = useState<any[]>([]);

  const { data, isLoading, isSuccess, refetch } = useGetAllFarmAnimals();

  const navigate = useNavigate();
  if (!isLoading && !isSuccess) navigate(-1 || '/');

  useEffect(() => {
    if (isSuccess) {
      setAnimals(data.data.animals);
    }
  }, [data, isSuccess]);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value || value.length) setAnimals(data.data.animals);

    setAnimals(data.data.animals.filter((animal: any) => animal?.number?.includes(value)));
  };

  const onFilterChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const value = event.currentTarget.getAttribute('data-value');

    setFilters((prev: any) => {
      if (prev.includes(value)) {
        return prev.filter((filVal: string) => filVal !== value);
      } else {
        return [...prev, value];
      }
    });
  }
  
  const { items } = usePrepareItems({ animals, filters });

  if(isLoading) return <Loader/>

  return (
    <MainSection block="herd">
      <div className="all-animals-container" id="herd-history-container">

        <div className="all-animals-search">
          <div className="all-animals-search-icon">
            <MagnifyingGlass size={20} color="#0a0a0a" weight="bold" />
          </div>
          <input type="text" placeholder="Номер животного" onChange={onSearch} />
        </div>

        <div className="history-page-categories-block">
          <div className={`hp-category  ${filters.includes('milking') ? 'hp-category-active' : ''}`} data-value="milking" onClick={onFilterChange}>
            <p>Доение</p>
          </div>
          <div className={`hp-category ${filters.includes('weight') ? 'hp-category-active' : ''}`} data-value="weight" onClick={onFilterChange}>
            <p>Взвешивание</p>
          </div>
          <div className={`hp-category ${filters.includes('lactation') ? 'hp-category-active' : ''}`} data-value="lactation" onClick={onFilterChange}>
            <p>Лактация</p>
          </div>
          <div className={`hp-category ${filters.includes('addition') ? 'hp-category-active' : ''}`} data-value="addition" onClick={onFilterChange}>
            <p>Добавление</p>
          </div>
          <div className={`hp-category ${filters.includes('write-off') ? 'hp-category-active' : ''}`} data-value="write-off" onClick={onFilterChange}>
            <p>Списание</p>
          </div>
        </div>

        <HistoryItemsContainer items={items} changeCall={() => refetch()}></HistoryItemsContainer>
      </div>
    </MainSection>
  )
}

export default HerdEditHistory;