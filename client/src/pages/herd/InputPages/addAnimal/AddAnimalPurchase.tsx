import React, { useState, useEffect } from "react";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from 'moment';

import animalNumberValidation from "../../../../utils/animalNumberValidation";
import breeds from "./data/breeds";

import MainSection from '../../../../components/MainSection';
import FormSection from '../../../../components/inputComponents/FormSection';
import BasicInput from "../../../../components/inputComponents/BasicInput";
import SubmitButton from "../../../../components/inputComponents/SubmitButton";
import BasicSelect from "../../../../components/inputComponents/BasicSelect";
import Picker from "../../../../components/inputComponents/Picker";
import FormConfirmation from "../../../../components/inputComponents/FormConfirmation";
import usePPDCall from "../../../../hooks/api/usePPDCall";
import useGetOneAnimal from "../../../../hooks/useGetOneAnimal";
import Loader from "../../../../components/otherComponents/loader/Loader";


const AddAnimalPurchase = () => {
  const [dataLoading, setdataLoading] = useState<boolean>(false);
  const [dataSuccess, setdataSuccess] = useState<boolean>(false);

  const [animalForEdit, setAnimalForEdit] = useState<any | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const edit = searchParams.get('edit') === 'true';
  const id = searchParams.get('id');

  if (edit && !id) navigate(-1 || '/');

  const { data: animalData, isLoading, isSuccess, isError } = useGetOneAnimal(id);

  if (edit && !isLoading && !isSuccess) navigate(-1 || '/');

  useEffect(() => {
    if (isSuccess) {
      setAnimalForEdit(animalData?.data?.animal);
    }
  }, [animalData, isSuccess]);

  const schema = yup.object().shape({
    number: yup.string().required('Укажите номер животного').min(1, 'Укажите номер животного').test(
      'is-unique',
      'Животное с таким номером уже существует',
      async (value) => {
        if(animalForEdit && value === animalForEdit.number) return true;
        return await animalNumberValidation(value.length === 0 ? '5026' : value)
      }
    ),
    name: yup.string().max(50, 'Имя должно быть короче 50 символов').default(undefined),
    birthDate: yup.string().required('Укажите дату рождения животного').test(
      'valid-date',
      'Укажите правильную дату рождения животного',
      (value) => {
        const parsedDate = value ? new Date(value) : null;
        if (!parsedDate || isNaN(parsedDate.getTime())) return false;

        if (parsedDate > new Date()) return false;

        return true;
      }
    ),
    breedRussian: yup.string(),
    gender: yup.string().required('Укажите пол животного').oneOf(['male', 'female']),
    colors: yup.array().default(undefined),
    buyCost: yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() === '') {
        return null;
      }
      return value;
    })
    .nullable().min(1, 'Стоимость должна быть больше 0')
  });

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues: {
    number: animalForEdit?.number || undefined,
    name: animalForEdit?.name || undefined,
    birthDate: animalForEdit?.birthDate
      ? moment(animalForEdit.birthDate).format('YYYY-MM-DD')
      : '',
    breedRussian: animalForEdit?.breedRussian || undefined,
    gender: animalForEdit?.gender || undefined,
    colors: animalForEdit?.colors || undefined,
    buyCost: animalForEdit?.buyCost || undefined,
  }});

  useEffect(() => {
    if (animalForEdit?.number) setValue('number', animalForEdit.number);
    if (animalForEdit?.name) setValue('name', animalForEdit.name);
    if (animalForEdit?.birthDate) setValue('birthDate', moment(animalForEdit.birthDate).format('YYYY-MM-DD'));
    if (animalForEdit?.buyCost) setValue('buyCost', animalForEdit.buyCost);

  }, [animalForEdit, setValue]);

  const type = !edit ? 'post' : 'patch';
  const url = !edit ? `/api/animals/animal/add` : `/api/animals/animal/edit/${id}`;
  const { mutate, status, error, data: resData } = usePPDCall({ type, url })
  const onSubmit = (data: any) => {
    setdataLoading(true);

    const formattedData = {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      breedRussian: data.breedRussian ? data.breedRussian : undefined,
      name: data.name ? data.name : undefined,
    }
    
    mutate(formattedData, {
      onSuccess: (res: any) => {
        setdataSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      }
    });
  }

  if(isLoading) return <Loader/>

  return (
    <MainSection block="herd">
      {dataSuccess && <FormConfirmation />}
      {!dataSuccess &&
        <FormSection onSubmit={handleSubmit(onSubmit)} title="Животное" toEdit={edit}>

          <BasicInput title="Номер" type="text" required={true} insideText={{ frontPlace: true, text: '#' }} error={errors?.number?.message} {...register('number')}></BasicInput>

          <BasicInput title="Имя" type="text" required={false} error={errors?.name?.message} {...register('name')}></BasicInput>

          <BasicInput title="Стоимость" type="number" required={false} error={errors?.buyCost?.message} {...register('buyCost')}></BasicInput>

          <BasicInput title="Дата рождения" type="date" required={true} error={errors?.birthDate?.message} {...register('birthDate')}></BasicInput>

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


          <SubmitButton isLoading={dataLoading} isFinished={dataSuccess}></SubmitButton>
        </FormSection>
      }

    </MainSection>
  )
}

export default AddAnimalPurchase;