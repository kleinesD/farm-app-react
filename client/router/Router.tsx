import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import RouteProtector from './protector';

/* Pages components */
import Login from '../src/pages/Login/Login';
import AddAnimal from '../src/pages/herd/InputPages/addAnimal/AddAnimal';
import AddAnimalBirth from '../src/pages/herd/InputPages/addAnimal/AddAnimalBirth';
import AddAnimalPurchase from '../src/pages/herd/InputPages/addAnimal/AddAnimalPurchase';
import AddDeadBirth from '../src/pages/herd/InputPages/addAnimal/AddDeadBirth';
import LactationForm from '../src/pages/herd/InputPages/lactation/LactationForm';
import WeightResultForm from '../src/pages/herd/InputPages/weightResult/WeightResultForm';
import MilkingResultForm from '../src/pages/herd/InputPages/milkingResult/MilkingResult';
import WriteOff from '../src/pages/herd/InputPages/writeOff/WriteOff';
import MilkingResultsList from '../src/pages/herd/InputPages/milkingResultsList/MilkingResultsList';
import HerdEditHistory from '../src/pages/herd/editHistory/HerdEditHistory';
import AnimalCard from '../src/pages/herd/animalCard/AnimalCard';
import MainPage from '../src/pages/Main/MainPage';
import AllAnimals from '../src/pages/herd/allAnimals/AllAnimals';
import HerdMain from '../src/pages/herd/main/HerdMain';
import MilkQualityForm from '../src/pages/herd/InputPages/milkQualityForm/MilkQualityForm';

export const AppRoutes = () => {
  const navigate = useNavigate()
  
  // For development purposes
  const mode = process.env.NODE_ENV === 'development';
  const hasRedirected = useRef(false);
  useEffect(() => {
    if(!mode || hasRedirected.current) return;

    //${process.env.PUBLIC_URL}
   

    // REF
    // If you need to set edit link. Each link must have edit=true and id=sub document _id

    hasRedirected.current = true;
    const route = '/herd'
    console.log(`Development: Navigating to ${route}`);
    navigate(`${route}`, { replace: true });
  }, [navigate]);

  return (
    <Routes>
      {/* FOR DEVELOPMENT */}

      <Route path="/login" element={<Login />}></Route>

      <Route path='/' element={<MainPage />}></Route>
      
      {/* Herd routes */}
      <Route path='/herd'>
        <Route path='' element={<HerdMain/>} />
        <Route path='animal/add' element={<AddAnimal/>} />
        <Route path='animal/add/alive/' element={<AddAnimalBirth/>}/>
        <Route path='animal/add/dead/' element={<AddDeadBirth/>}/>
        <Route path='lactation/:id' element={<LactationForm/>}></Route>
        <Route path='weight/:id' element={<WeightResultForm/>}></Route>
        <Route path='milking/:id' element={<MilkingResultForm/>}></Route>
        <Route path='write-off' element={<WriteOff/>}></Route>
        <Route path='list/milking' element={<MilkingResultsList/>}></Route>
        <Route path='history' element={<HerdEditHistory/>}></Route>
        <Route path='animal/card/:id' element={<AnimalCard/>}></Route>
        <Route path='animals/list' element={<AllAnimals/>}></Route>
        <Route path='milk/quality' element={<MilkQualityForm/>}></Route>
      </Route>

      <Route path='*' element={<MainPage />}></Route>
      
    </Routes>
  )
}