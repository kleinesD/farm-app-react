import React, { useState, useEffect } from "react";
import moment from "moment";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useSearchParams } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import MainSection from "../../../../components/MainSection";
import FormSection from "../../../../components/inputComponents/FormSection";
import BasicSelect from "../../../../components/inputComponents/BasicSelect";
import useGetFarmAnimals from "../../../../hooks/useGetFarmAnimals";
import AnimalSelect from "../../../../components/inputComponents/AnimalSelect";
import Picker from "../../../../components/inputComponents/Picker";
import useGetFarmClients from "../../../../hooks/useGetFarmClients";
import BasicInput from "../../../../components/inputComponents/BasicInput";
import NoteInput from "../../../../components/inputComponents/NoteInput";
import SubmitButton from "../../../../components/inputComponents/SubmitButton";
import useMultiplePPDCalls from "../../../../hooks/api/useMultiplePPDCalls";
import Loader from "../../../../components/otherComponents/loader/Loader";

const WriteOff: React.FC = () => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataSuccess, setDataSuccess] = useState<boolean>(false);
  const [animalsOptions, setAnimalsOptions] = useState<[]>([]);
  const [clientsOptions, setClientsOptions] = useState<[]>([]);
  const [selectedAnimalsOptions, setSelectedAnimalsOptions] = useState<[]>([]);
  const [reqAnimals, setReqAnimals] = useState<any[] | null>(null);

  const [searchParams] = useSearchParams();
  const reqAnimalsString = searchParams.get('animals');

  useEffect(() => {
    setReqAnimals(reqAnimalsString ? reqAnimalsString.split(',') : null);
  }, [reqAnimalsString]);

  const navigate = useNavigate();
  const location = useLocation();

  //const { id } = useParams();
  const { data: animalsData, isLoading, isSuccess } = useGetFarmAnimals();
  const { data: clientsData, isSuccess: clientsSuccess } = useGetFarmClients();

  //if(!isLoading && !isSuccess) navigate(-1 || '/');

  useEffect(() => {
    if (reqAnimals && animalsData) {
      setSelectedAnimalsOptions(animalsData.data.animals.filter((animal: any) => reqAnimals.includes(animal.number)).map((animal: any) => {
        return {
          title: `#${animal.number}`,
          value: animal._id,
          gender: animal.gender
        }
      }))

      setReqAnimals(null);
    }
  }, [reqAnimals, animalsData]);

  useEffect(() => {
    if (isSuccess) {
      setAnimalsOptions(animalsData.data.animals.map((animal: any) => {
        return {
          title: `#${animal.number}`,
          value: animal._id,
          subTitle: animal?.name
        }
      }));
    }
  }, [isSuccess, animalsData])


  useEffect(() => {
    if (clientsSuccess) {
      setClientsOptions(clientsData.data.clients.map((client: any) => {
        return {
          title: client.name,
          value: client._id,
        }
      }));
    }
  }, [clientsSuccess, clientsData])

  const schema = yup.object().shape({
    preAnimals: yup.array().of(yup.string()).min(1, 'Добавьте животных'),
    animals: yup.array().of(yup.object()).required('Добавьте животных'),
    writeOffDate: yup.string().required('Введите дату списания').test(
      'valid-date',
      'Введите правильную дату списания',
      (value) => {
        const parsedDate = value ? new Date(value) : null;
        if (!parsedDate || isNaN(parsedDate.getTime())) return false;

        if (parsedDate > new Date()) return false;

        return true;
      }
    ),
    writeOffReason: yup.string().oneOf(['sickness', 'sold']),
    writeOffSubReason: yup.string().oneOf(['slaughtered', 'alive']),
    client: yup.string(),
    writeOffNote: yup.string()
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({ resolver: yupResolver(schema) });

  const selectedAnimals = watch('preAnimals') || [];
  const reason = watch('writeOffReason');
  const animals = watch('animals');

  useEffect(() => {
    if (selectedAnimals?.length > 0 && animalsData) {
      setSelectedAnimalsOptions(animalsData.data.animals.filter((animal: any) => selectedAnimals?.includes(animal._id)).map((animal: any) => {
        return {
          title: `#${animal.number}`,
          value: animal._id,
          gender: animal.gender
        }
      }))
    }

  }, [selectedAnimals])

  const { mutate, onSuccess, status } = useMultiplePPDCalls({ type: 'patch' });

  // Submit handler
  const submit = (data: any) => {
    setDataLoading(true);
    // Convert strings back to Date objects for backend submission

    const formattedData = data.animals.map((animal: any) => {
      return {
        url: `/api/animals/write-off/animal/${animal.value}`,
        data: {
          ...data,
          animals: undefined,
          preAnimals: undefined,
          writeOffDate: new Date(data.writeOffDate),
          writeOffRevenue: animal.inputValue ? animal.inputValue : undefined,
          writeOffNote: data.writeOffNote ? data.writeOffNote : undefined
        }
      }
    });

    mutate(formattedData, {
      onSuccess: () => {
        setDataSuccess(true);

        setTimeout(() => {
          navigate(location.pathname + location.search);
        }, 2000)
      }
    })
  };

  if (isLoading) return <Loader />

  return (
    <MainSection block="herd">
      <FormSection toEdit={false} onSubmit={handleSubmit(submit)} title="Списание">

        <Controller name="preAnimals" control={control} render={({ field }) => (
          <BasicSelect title="Выберите животных" multiSelect={true} required={true} options={animalsOptions} value={animals?.map((animal: any) => animal.value)} placeholder="Номер животного" onSelect={(selected) => setValue('preAnimals', selected)} error={errors?.preAnimals?.message}></BasicSelect>
        )}></Controller>

        {selectedAnimalsOptions.length > 0 &&
          <Controller name="animals" control={control} render={({ field }) => (
            <AnimalSelect withInput={reason === 'sold' ? true : false} onChange={(output: any) => setValue('animals', output)} options={selectedAnimalsOptions}></AnimalSelect>
          )}></Controller>
        }

        <Controller name="writeOffReason" control={control} render={({ field }) => (
          <Picker required={false} title="Причина" options={[{ title: 'Падеж', value: 'sickness' }, { title: 'Продажа', value: 'sold' }]} onPick={(picked) => setValue('writeOffReason', picked[0])} error={errors?.writeOffReason?.message} />
        )} />

        {reason === 'sold' &&
          <Controller name="writeOffSubReason" control={control} render={({ field }) => (
            <Picker required={false} title="Способ продажи" options={[{ title: 'Забой', value: 'slaughtered' }, { title: 'Живьем', value: 'alive' }]} onPick={(picked) => setValue('writeOffSubReason', picked[0])} error={errors?.writeOffSubReason?.message} />
          )} />
        }

        {reason === 'sold' &&
          <Controller name="client" control={control} render={({ field }) => (
            <BasicSelect title="Выберите клиента" multiSelect={false} required={false} options={clientsOptions} placeholder="Наименование клиента" onSelect={(selected) => setValue('client', selected[0])}></BasicSelect>
          )}></Controller>
        }

        <BasicInput title="Дата" type="date" required={true} error={errors?.writeOffDate?.message} {...register('writeOffDate')}></BasicInput>

        <NoteInput required={false} title="Заметка" {...register('writeOffNote')} />

        <SubmitButton isLoading={dataLoading} isFinished={dataSuccess}></SubmitButton>

      </FormSection>
    </MainSection>
  )
}

export default WriteOff;