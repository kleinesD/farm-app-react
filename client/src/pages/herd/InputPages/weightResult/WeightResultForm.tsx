import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import moment from 'moment';
import MainSection from '../../../../components/MainSection';
import FormSection from '../../../../components/inputComponents/FormSection';
import useGetOneAnimal from '../../../../hooks/useGetOneAnimal';
import BasicInput from '../../../../components/inputComponents/BasicInput';
import SubmitButton from '../../../../components/inputComponents/SubmitButton';
import usePPDCall from '../../../../hooks/api/usePPDCall';
import FormConfirmation from '../../../../components/inputComponents/FormConfirmation';
import Loader from '../../../../components/otherComponents/loader/Loader';

const WeightResultForm: React.FC = () => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataSuccess, setDataSuccess] = useState<boolean>(false);

  const [docForEdit, setDocForEdit] = useState<any>(null);
  const [docHistory, setDocHistory] = useState<[]>([]);
  const [url, setUrl] = useState<string>('');

  const [searchParams] = useSearchParams();

  const { id } = useParams();

  const edit = searchParams.get('edit') === 'true';
  const subId = searchParams.get('id');

  const { data, isLoading, isSuccess, isError, error } = useGetOneAnimal(id!);

  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoading && !isSuccess || edit && !subId) navigate(-1 || '/');

  useEffect(() => {
    if (isSuccess) {
      const animal = data.data.animal;

      setDocForEdit(null);
      setDocForEdit(animal.weightResults.find((wR: any) => wR._id === subId));

      animal.weightResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setDocHistory([]);
      setDocHistory(animal.weightResults.map((wR: any) => {
        return {
          link: `/herd/weight/${animal._id}/?edit=true&id=${wR._id}`,
          text: `${wR.result} кг.`,
          date: `${moment(wR.date).locale('ru').format('DD MMM YY').toUpperCase()}`
        }
      }))

      setUrl(!edit ? `/api/animals/weight/${animal._id}` : `/api/animals/weight/${animal._id}/${subId}`)
    }
  }, [isSuccess, data, edit, subId])

  const schema = yup.object().shape({
    result: yup.number().required('Введите вес животного').min(0, 'Вес животного должен быть больше 0'),
    date: yup.string().required('Введите дату записи изменения веса').test(
      'valid-date',
      'Введите правильную дату изменения веса',
      (value) => {
        const parsedDate = value ? new Date(value) : null;
        if (!parsedDate || isNaN(parsedDate.getTime())) return false;

        if (parsedDate > new Date()) return false;

        return true;
      }
    )
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      result: docForEdit?.result || null,
      date: docForEdit?.date
        ? moment(docForEdit.date).format('YYYY-MM-DD')
        : '',
    },
  });

  // Set values for the inputs
  useEffect(() => {
    if (docForEdit?.date) {
      setValue('date', moment(docForEdit.date).format('YYYY-MM-DD'));
    }
    if (docForEdit?.result) {
      setValue('result', docForEdit.result);
    }
  }, [docForEdit, setValue]);

  const type = !edit ? 'post' : 'patch';
  const { mutate, onSuccess, status } = usePPDCall({ type, url });

  // Submit handler
  const submit = (data: any) => {
    setDataLoading(true);
    // Convert strings back to Date objects for backend submission
    const formattedData = {
      ...data,
      date: new Date(data.date),
      _id: subId ? subId : undefined
    };

    mutate(formattedData, {
      onSuccess: () => {
        setDataSuccess(true);

        setTimeout(() => {
          navigate(location.pathname + location.search);
        }, 2000)
      }
    })
  };

  if (isLoading) return <Loader/>

  return (
    <MainSection block='herd' animal={data?.data?.animal ? data?.data?.animal : undefined}>
      {dataSuccess && <FormConfirmation />}
      {isSuccess && !dataSuccess &&
        <FormSection onSubmit={handleSubmit(submit)} title="Изменение веса" toEdit={edit} history={!edit ? docHistory : undefined}>

          <BasicInput title='Вес' type='number' insideText={{ frontPlace: false, text: 'кг.' }} required={true} error={errors?.result?.message} {...register('result')} />

          <BasicInput title='Дата' type='date' required={true} error={errors?.date?.message} {...register('date')} />

          <SubmitButton isLoading={false} isFinished={false}></SubmitButton>
        </FormSection>

      }
    </MainSection>
  )
}

export default WeightResultForm