import React, { useState, useEffect } from "react";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoClose } from "react-icons/io5";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import moment from 'moment';

import animalNumberValidation from "../../../../utils/animalNumberValidation";
import breeds from "./data/breeds";
import useGetParents from "../../../../hooks/useGetAnimalParents";

import MainSection from '../../../../components/MainSection';
import FormSection from '../../../../components/inputComponents/FormSection';
import BasicInput from "../../../../components/inputComponents/BasicInput";
import SubmitButton from "../../../../components/inputComponents/SubmitButton";
import BasicSelect from "../../../../components/inputComponents/BasicSelect";
import Picker from "../../../../components/inputComponents/Picker";
import CombinedBlock from "../../../../components/inputComponents/CombinedBlock";
import NoteInput from "../../../../components/inputComponents/NoteInput";
import FormConfirmation from "../../../../components/inputComponents/FormConfirmation";
import usePPDCall from "../../../../hooks/api/usePPDCall";
import RadioButton from "../../../../components/inputComponents/RadioButton";
import useGetOneAnimal from "../../../../hooks/useGetOneAnimal";
import Loader from "../../../../components/otherComponents/loader/Loader";

const AddDeadBirth = () => {
  const { data, isLoading } = useGetParents();
  const [dataLoading, setdataLoading] = useState<boolean>(false);
  const [dataSuccess, setdataSuccess] = useState<boolean>(false);
  const femalesLength = data?.females?.length || 0;
  const malesLength = data?.males?.length || 0;

  const [animalForEdit, setAnimalForEdit] = useState<any | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const edit = searchParams.get('edit') === 'true';
  const id = searchParams.get('id');

  if (edit && !id) navigate(-1 || '/');

  const { data: animalData, isLoading: isLoadingAnimal, isSuccess, isError } = useGetOneAnimal(id);

  if (edit && !isLoading && !isSuccess) navigate(-1 || '/');

  useEffect(() => {
    if (isSuccess) {
      setAnimalForEdit(animalData?.data?.animal);
    }
  }, [animalData, isSuccess]);

  const schema = yup.object().shape({
    status: yup.string().default('dead-birth'),
    deadBirthDate: yup.string().required('Укажите дату').test(
      'valid-date',
      'Укажите правильную дату',
      (value) => {
        const parsedDate = value ? new Date(value) : null;
        if (!parsedDate || isNaN(parsedDate.getTime())) return false;

        if (parsedDate > new Date()) return false;

        return true;
      }
    ),
    breedRussian: yup.string(),
    gender: yup.string().required('Укажите пол животного').oneOf(['male', 'female']),
    mother: yup.string(),
    father: yup.string(),
    colors: yup.array().default(undefined),
    deadBirthMultipleFetuses: yup.boolean().default(false),
    deadBirthMotherDeath: yup.boolean().default(false),
    deadBirthSize: yup.string(),
    deadBirthNote: yup.string()
  });

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema), });

  useEffect(() => {
    if (animalForEdit?.deadBirthDate) setValue('deadBirthDate', moment(animalForEdit.deadBirthDate).format('YYYY-MM-DD'));
    if (animalForEdit?.deadBirthNote) setValue('deadBirthNote', animalForEdit.deadBirthNote);

  }, [animalForEdit, setValue]);

  const type = !edit ? 'post' : 'patch';
  const url = !edit ? `/api/animals/animal/add` : `/api/animals/animal/edit/${id}`;
  const { mutate, status, error, data: resData } = usePPDCall({ type, url });
  const onSubmit = (data: any) => {
    setdataLoading(true);

    const formattedData = {
      ...data,
      deadBirthDate: data.deadBirthDate ? new Date(data.deadBirthDate) : undefined,
      mother: data.mother !== '' ? data.mother : undefined,
      father: data.father !== '' ? data.father : undefined,
      deadBirthNote: data.deadBirthNote !== '' ? data.deadBirthNote : undefined,
      
    }
    
    mutate(formattedData, {
      onSuccess: (res: any) => {
        setdataSuccess(true);
        setTimeout(() => {
          navigate(location.pathname + location.search);
        }, 2000)
      }
    });
  }

  if(isLoading) return <Loader/>

  return (
    <MainSection block="herd">
      {dataSuccess && <FormConfirmation />}
      {!isLoading && !dataSuccess &&
        <FormSection onSubmit={handleSubmit(onSubmit)} title="Мертворождение" toEdit={edit}>

          <BasicInput title="Дата" type="date" required={true} error={errors?.deadBirthDate?.message} {...register('deadBirthDate')}></BasicInput>

          {femalesLength > 0 && <Controller name="mother" control={control} render={({ field }) => (
            <BasicSelect required={false} title="Мать" options={data!.females} placeholder="Номер коровы" onSelect={(selected) => setValue('mother', selected[0])} value={animalForEdit?.mother && [animalForEdit.mother._id]} error={errors?.mother?.message}></BasicSelect>)} />}

          <Controller name="deadBirthMotherDeath" control={control} render={({ field }) => (
            <RadioButton title="Привело к смерти матери" defaultPicked={animalForEdit?.deadBirthMotherDeath && animalForEdit.deadBirthMotherDeath} required={false} onClick={(clicked) => setValue('deadBirthMotherDeath', clicked)} />)} />

          {malesLength > 0 && <Controller name="father" control={control} render={({ field }) => (
            <BasicSelect required={false} title="Отец животного" options={data!.males} placeholder="Номер быка" onSelect={(selected) => setValue('father', selected[0])} value={animalForEdit?.father && [animalForEdit.father._id]} error={errors?.father?.message}></BasicSelect>)} />}

          <Controller name="deadBirthMultipleFetuses" control={control} render={({ field }) => (
            <RadioButton title="Беременность с несколькими плодами" defaultPicked={animalForEdit?.deadBirthMultipleFetuses && animalForEdit.deadBirthMultipleFetuses} required={false} onClick={(clicked) => setValue('deadBirthMultipleFetuses', clicked)} />)} />

          <Controller name="deadBirthSize" control={control} render={({ field }) => (
            <Picker required={true} title="Размер плода" options={[
              { title: 'Маленький', value: 'small' },
              { title: 'Средний', value: 'mid' },
              { title: 'Большой', value: 'large' }
            ]} onPick={(picked) => setValue('deadBirthSize', picked[0])} value={animalForEdit?.deadBirthSize && [animalForEdit.deadBirthSize]} error={errors?.deadBirthSize?.message} />
          )} />

          <Controller name="breedRussian" control={control} render={({ field }) => (
            <BasicSelect required={false} title="Порода" options={breeds} placeholder="Наименование породы" onSelect={(selected) => setValue('breedRussian', selected[0])} value={animalForEdit?.breedRussian && [animalForEdit.breedRussian]} error={errors?.breedRussian?.message}></BasicSelect>)} />

          <Controller name="gender" control={control} render={({ field }) => (
            <Picker required={true} title="Пол" options={[{ title: 'Мужской', value: 'male' }, { title: 'Женский', value: 'female' }]} onPick={(picked) => setValue('gender', picked[0])} value={animalForEdit?.gender && [animalForEdit.gender]} error={errors?.gender?.message} />
          )} />

          <Controller name="colors" control={control} render={({ field }) => (
            <Picker required={false} multiSelect={true} title="Окрас" options={[
              { title: 'Черный', value: 'black' },
              { title: 'Красный', value: 'red' },
              { title: 'Белый', value: 'white' }
            ]} onPick={(picked) => setValue('colors', picked)} value={animalForEdit?.colors && [...animalForEdit.colors]} error={errors?.colors?.message} />
          )} />

          <NoteInput required={false} title="Заметка" {...register('deadBirthNote')}/>


          <SubmitButton isLoading={dataLoading} isFinished={dataSuccess}></SubmitButton>
        </FormSection>
      }

    </MainSection>
  )
}

export default AddDeadBirth;

