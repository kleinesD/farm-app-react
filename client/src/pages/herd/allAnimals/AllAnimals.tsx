import React, { useState, useEffect, ChangeEvent } from "react";
import MainSection from "../../../components/MainSection";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Filters from "./components/Filters";
import SlaughterSuggestion from "./components/SlaughterSuggestion";
import useGetAllFarmAnimals from "../../../hooks/useGetAllFarmAnimals";
import Loader from "../../../components/otherComponents/loader/Loader";
import useFilterAnimals from "./hooks/useFilterAnimals";
import AnimalItem from "./components/AnimalItem";
import MultipleAnimalsActions from "./components/MultipleAnimalsActions";

const AllAnimals: React.FC = () => {
  const [filteredAnimals, setFilteredAnimals] = useState<any>([]);
  const [searchedAnimals, setSearchedAnimals] = useState<any>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<any[]>([]);
  const [pendingSelection, setPendingSelection] = useState<any | null>(null);


  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  if (!filter) navigate(-1 || '/');

  const farm = useSelector((state: any) => state.user.data.farm);

  const { data, isLoading, isSuccess } = useGetAllFarmAnimals()

  useEffect(() => {
    if (isSuccess) {
      setFilteredAnimals(useFilterAnimals({ filter, animals: data.data.animals }))
      setSearchedAnimals(useFilterAnimals({ filter, animals: data.data.animals }))
    }
  }, [data, filter]);



  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length === 0) return setSearchedAnimals(filteredAnimals);

    const filAn = filteredAnimals.filter((animal: any) => animal.name?.includes(value) || animal.number?.includes(value));

    setSearchedAnimals(filAn);
  }

  document.addEventListener('click', (event) => {
    setActiveMenu(null)
  });
  useEffect(() => {
    if (pendingSelection !== null) {
      setSelectedAnimals((prevSelected) => {
        const isAlreadySelected = prevSelected.some((a: any) => a._id === pendingSelection.animal._id);

        if (pendingSelection.add && !isAlreadySelected) {
          return [...prevSelected, pendingSelection.animal]; // Add to selection
        } else if (!pendingSelection.add) {
          return prevSelected.filter((a: any) => a._id !== pendingSelection.animal._id); // Remove from selection
        }
        return prevSelected; // No change
      });

      setPendingSelection(null); // Reset after update
    }
  }, [pendingSelection]);

  const handleSelection = (obj: any) => {
    setPendingSelection(obj); // Store selection request for next render
  };

  if (isLoading) return <Loader />

  return (
    <MainSection block="herd">
      <div className="all-animals-container">
        <div className="main-page-header">
          <div className="main-page-header-title main-page-header-title-center">СПИСОК ЖИВОТНЫХ</div>
        </div>

        <div className="all-animals-search">
          <MagnifyingGlass size={20} color="#afafaf" weight="bold" className="all-animals-search-icon" />
          <input type="text" placeholder="Номер или кличка животного" onChange={handleSearch} />
        </div>

        <div className="all-animals-page-info">
          <div className="all-animals-counter">Показано животных: {searchedAnimals.length}</div>
        </div>

        <Filters filter={filter!}></Filters>

        {selectedAnimals.length > 0 &&
          <MultipleAnimalsActions animals={selectedAnimals}></MultipleAnimalsActions>
        }

        {filter === 'slaughter' && <SlaughterSuggestion farm={farm} />}

        <div className="animal-list-header">
          <div className="alh-item alh-item-photo">Фото</div>
          <div className="alh-item">#</div>
          <div className="alh-item">Возраст</div>
          <div className="alh-item">Пол</div>

          {filter === 'slaughter' && <div className="alh-item alh-item-info">Причина для забоя</div>}

          {filter !== 'slaughter' && <div className="alh-item alh-item-info">Важная информация</div>}
        </div>

        <div className="animals-list-block">
          {searchedAnimals.map((animal: any, index: number) => (
            <AnimalItem key={Math.random().toString(36)} animal={animal} filter={filter} activeMenu={activeMenu} setActiveMenu={setActiveMenu} selected={(obj) => handleSelection(obj)} selectDefault={selectedAnimals.find((a: any) => a._id === animal._id)}/>
          ))}
        </div>

      </div>
    </MainSection>
  )
}

export default AllAnimals;