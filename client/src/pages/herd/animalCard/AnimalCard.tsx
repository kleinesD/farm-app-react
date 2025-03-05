import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainSection from '../../../components/MainSection';
import useGetOneAnimal from '../../../hooks/useGetOneAnimal';
import CardActionsMenu from './components/CardActionsMenu';
import WriteOffDis from './components/WriteOffDisc';
import HeaderInfo from './components/header/HeaderInfo';
import ButcherSuggestion from './components/ButcherSuggestion';
import UnconfirmedInsemination from './components/UnconfirmedInsemination';
import FamilyTree from './components/FamilyTree';
import Lactations from './components/Lactations';
import WeightResults from './components/WeightResults';
import Notes from './components/Notes';
import MilkingResults from './components/milkingResults/MilkingResults';
import Loader from '../../../components/otherComponents/loader/Loader';

const AnimalCard: React.FC = () => {
  const [animal, setAnimal] = useState<any>();

  const { id } = useParams();

  const { data, isLoading, isSuccess, refetch, isFetching } = useGetOneAnimal(id!);

  useEffect(() => {
    refetch();
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      setAnimal(data.data.animal);
    }
  }, [data, isSuccess]);

  if (isLoading) return <Loader/>
  if (isFetching) return <Loader/>
  return (
    <div key={id}>
      <CardActionsMenu animal={animal}></CardActionsMenu>
      <Notes animal={animal} refetch={refetch}></Notes>
      <MainSection block='herd'>
        <div className='animal-card-section'>

          {animal?.status !== 'alive' && <WriteOffDis animal={animal}></WriteOffDis>}

          <HeaderInfo animal={animal}></HeaderInfo>

          {animal?.butcherSuggestion &&
            <ButcherSuggestion animal={animal}></ButcherSuggestion>
          }

          {animal?.inseminations?.at(-1) && animal?.inseminations?.at(-1)?.success === 'undefined' &&
            <UnconfirmedInsemination animal={animal}></UnconfirmedInsemination>
          }

          {(animal?.mother || animal?.father || animal?.motherCalves.length > 0 || animal?.fatherCalves.length > 0) &&
            <FamilyTree animal={animal}></FamilyTree>
          }

          {animal?.lactations?.length > 0 &&
            <Lactations animal={animal}></Lactations>
          }

          {animal?.milkingResults.length > 0 &&
            <MilkingResults animal={animal}></MilkingResults>}

          {animal?.weightResults?.length > 0 &&
            <WeightResults animal={animal}></WeightResults>
          }

        </div>
      </MainSection>
    </div>
  )
};

export default AnimalCard;
