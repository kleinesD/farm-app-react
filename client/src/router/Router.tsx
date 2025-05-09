import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import RouteProtector from './protector';

/* Pages components */
import Login from '../pages/Login/Login';
import AddAnimal from '../pages/herd/InputPages/addAnimal/AddAnimal';
import AddAnimalBirth from '../pages/herd/InputPages/addAnimal/AddAnimalBirth';
import AddAnimalPurchase from '../pages/herd/InputPages/addAnimal/AddAnimalPurchase';
import AddDeadBirth from '../pages/herd/InputPages/addAnimal/AddDeadBirth';
import LactationForm from '../pages/herd/InputPages/lactation/LactationForm';
import WeightResultForm from '../pages/herd/InputPages/weightResult/WeightResultForm';
import MilkingResultForm from '../pages/herd/InputPages/milkingResult/MilkingResult';
import WriteOff from '../pages/herd/InputPages/writeOff/WriteOff';
import MilkingResultsList from '../pages/herd/InputPages/milkingResultsList/MilkingResultsList';
import HerdEditHistory from '../pages/herd/editHistory/HerdEditHistory';
import AnimalCard from '../pages/herd/animalCard/AnimalCard';
import MainPage from '../pages/Main/MainPage';
import AllAnimals from '../pages/herd/allAnimals/AllAnimals';
import HerdMain from '../pages/herd/main/HerdMain';
import MilkQualityForm from '../pages/herd/InputPages/milkQualityForm/MilkQualityForm';
import VetAction from '../pages/vet/inputPages/vetAction/VetAction';

export const AppRoutes = () => {
  const navigate = useNavigate()

  // For development purposes
  const mode = process.env.NODE_ENV === 'development';
  const hasRedirected = useRef(false);
  useEffect(() => {
    if (!mode || hasRedirected.current) return;

    //${process.env.PUBLIC_URL}


    // REF
    // If you need to set edit link. Each link must have edit=true and id=sub document _id

    hasRedirected.current = true;
    const route = '/vet/action'
    console.log(`Development: Navigating to ${route}`);
    navigate(`${route}`, { replace: true });
  }, [navigate]);

  return (
    <Routes>
      {/* FOR DEVELOPMENT */}

      <Route path="/login" element={<Login />}></Route>

      <Route path='/' element={<RouteProtector >{<MainPage />}</RouteProtector>}></Route>

      {/* Herd routes */}
      <Route path='/herd'>


        <Route path='' element={<RouteProtector block='herd'>{<HerdMain />}</RouteProtector>}></Route>
        <Route path='animal/add' element={<RouteProtector block='herd'>{<AddAnimal />}</RouteProtector>}></Route>
        <Route path='animal/add/alive/' element={<RouteProtector block='herd'>{<AddAnimalBirth />}</RouteProtector>}></Route>
        <Route path='animal/add/dead/' element={<RouteProtector block='herd'>{<AddDeadBirth />}</RouteProtector>}></Route>
        <Route path='lactation/:id' element={<RouteProtector block='herd'>{<LactationForm />}</RouteProtector>}></Route>
        <Route path='weight/:id' element={<RouteProtector block='herd'>{<WeightResultForm />}</RouteProtector>}></Route>
        <Route path='milking/:id' element={<RouteProtector block='herd'>{<MilkingResultForm />}</RouteProtector>}></Route>
        <Route path='write-off' element={<RouteProtector block='herd'>{<WriteOff />}</RouteProtector>}></Route>
        <Route path='list/milking' element={<RouteProtector block='herd'>{<MilkingResultsList />}</RouteProtector>}></Route>
        <Route path='history' element={<RouteProtector block='herd'>{<HerdEditHistory />}</RouteProtector>}></Route>
        <Route path='animal/card/:id' element={<RouteProtector block='herd'>{<AnimalCard />}</RouteProtector>}></Route>
        <Route path='animals/list' element={<RouteProtector block='herd'>{<AllAnimals />}</RouteProtector>}></Route>
        <Route path='milk/quality' element={<RouteProtector block='herd'>{<MilkQualityForm />}</RouteProtector>}></Route>

      </Route>

      {/* Vet routes */}
      <Route path='/vet'>
        <Route path='action' element={<RouteProtector block='vet'>{<VetAction />}</RouteProtector>}></Route>
      </Route>

      <Route path='*' element={<MainPage />}></Route>

    </Routes>
  )
}