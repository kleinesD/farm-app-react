import React, { useState, useEffect } from "react";
import MainSection from "../../../components/MainSection";
import Header from "./components/Header";
import useGetFarmAnimals from "../../../hooks/useGetFarmAnimals";
import Loader from "../../../components/otherComponents/loader/Loader";
import QuickInfo from "./components/QuickInfo";
import Classification from "./components/Classification";
import MilkingResults from "./components/milkingResults/MilkingResults";
import HerdProjection from "./components/herdProjection/HerdProjection";
import MilkQuality from "./components/milkQuality/MilkQuality";
import WeightResults from "./components/weightResuls/WeightResults";
import WrriteOffSuggestions from "./components/WrriteOffSuggestions";

const HerdMain: React.FC = () => {
  const [animals, setAnimals] = useState<any[]>([]);
  const [animalsCategories, setAnimalsCategories] = useState<any>(null);

  const { data, isLoading, isSuccess } = useGetFarmAnimals();

  useEffect(() => {
    if (isSuccess) {
      setAnimals(data.data.animals)
      setAnimalsCategories({
        all: data.data.animals,
        cows: data.data.animals.filter((anim: any) => anim.gender === 'female' && anim.lactations?.length > 0),
        bulls: data.data.animals.filter((anim: any) => anim.gender === 'male'),
        milkingCows: data.data.animals.filter((anim: any) => anim.gender === 'female' && anim.lactations?.length > 0 && !anim.lactations.at(-1).finishDate),
        butcherAnimals: data.data.animals.filter((anim: any) => anim.butcherSuggestion),
        heifers: data.data.animals.filter((anim: any) => anim.gender === 'female' && anim.lactations?.length === 0)
      })
    }
  }, [data, isSuccess]);



  if (isLoading) return <Loader />
  return (
    <MainSection block="herd">
      <div className="dist-main-section">
        <Header />

        <div className="herd-mp-flex-block">
          {animalsCategories && <QuickInfo categories={animalsCategories} />}
          {animals.length > 0 && <Classification animals={animals} />}
        </div>

        {animals.length > 0 && <MilkingResults animals={animals} />}

        {animals.length > 0 && <HerdProjection animals={animals} />}

        <MilkQuality/>

        {animals.length > 0 && <WeightResults animals={animals} />}

        {animals.length > 0 && <WrriteOffSuggestions animals={animals} />}

      </div>
    </MainSection>
  )
}

export default HerdMain;