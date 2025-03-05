import React from "react"

interface FilterAnimalsInt {
  filter: any,
  animals: any[]
}

const useFilterAnimals = ({filter, animals}: FilterAnimalsInt) => {
  let filteredAnimals = [];

  if(filter === 'all') {
    filteredAnimals = animals;
  }

  if(filter === 'bulls') {
    filteredAnimals = animals.filter((animal: any) => animal.gender === 'male' && animal.status === 'alive');
  }

  if(filter === 'cows') {
    filteredAnimals = animals.filter((animal: any) => animal.gender === 'female' && animal.status === 'alive' && animal.lactations?.length > 0);
  }

  if(filter === 'heifers') {
    filteredAnimals = animals.filter((animal: any) => animal.gender === 'female' && animal.status === 'alive' && animal.lactations?.length === 0);
  }

  if(filter === 'diseased') {
    filteredAnimals = animals.filter((animal: any) => animal.status !== 'alive' );
  }

  if(filter === 'slaughter') {
    filteredAnimals = animals.filter((animal: any) => animal.status === 'alive' && animal.butcherSuggestion);
  }

  return filteredAnimals;
}

export default useFilterAnimals;