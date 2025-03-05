import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import moment from 'moment';
import Picker from '../../../../components/inputComponents/Picker';
import MainSection from '../../../../components/MainSection';
import FormSection from '../../../../components/inputComponents/FormSection';
import useGetOneAnimal from '../../../../hooks/useGetOneAnimal';
import BasicInput from '../../../../components/inputComponents/BasicInput';
import SubmitButton from '../../../../components/inputComponents/SubmitButton';
import usePPDCall from '../../../../hooks/api/usePPDCall';
import FormConfirmation from '../../../../components/inputComponents/FormConfirmation';
import Loader from '../../../../components/otherComponents/loader/Loader';

const MilkingResultForm: React.FC = () => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataSuccess, setDataSuccess] = useState<boolean>(false);

  const [docForEdit, setDocForEdit] = useState<any>(null);
  const [docHistory, setDocHistory] = useState<[]>([]);
  const [url, setUrl] = useState<string>('');

  const [lactations, setLactations] = useState<[]>([]);
  const [lactationOptions, setLactationOptions] = useState<[]>([]);
  const [lactationValue, setLactationValue] = useState<string>('')

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
      setDocForEdit(animal.milkingResults.find((mR: any) => mR._id === subId));

      animal.milkingResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setDocHistory([]);
      setDocHistory(animal.milkingResults.map((mR: any) => {
        return {
          link: `/herd/milking/${animal._id}/?edit=true&id=${mR._id}`,
          text: `${mR.result} л.`,
          date: `${moment(mR.date).locale('ru').format('DD MMM YY').toUpperCase()}`
        }
      }))

      setUrl(!edit ? `/api/animals/milking/${animal._id}` : `/api/animals/milking/${animal._id}/${subId}`)

      setLactations(animal.lactations);

      setLactationOptions(animal.lactations.map((lact: any) => { return { title: `#${lact.number}`, value: lact.number.toString(), nonSelect: true } }))
    }
  }, [isSuccess, data, edit, subId])

  const schema = yup.object().shape({
    result: yup.number().required('Введите результат контрольного доения').min(0, 'Результат должен быть больше 0'),
    date: yup.string().required('Введите дату контрольного доения').test(
      'valid-date',
      'Введите правильную дату контрольного доения',
      (value) => {
        const parsedDate = value ? new Date(value) : null;
        if (!parsedDate || isNaN(parsedDate.getTime())) return false;

        //if (parsedDate > new Date()) return false;

        return lactations.find((lact: any) => new Date(lact.startDate) <= parsedDate && parsedDate <= (lact.finishDate ? new Date(lact.finishDate) : new Date()));
      }
    ),
    lactationNumber: yup.number().required('Результат контрольного доения должен относиться к одной из лактаций')
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      result: docForEdit?.result || undefined,
      date: docForEdit?.date
        ? moment(docForEdit.date).format('YYYY-MM-DD')
        : '',
      lactationNumber: docForEdit?.lactationNumber || undefined
    },
  });
  const resultDate = watch('date');
  // Set values for the inputs
  useEffect(() => {
    if (docForEdit?.date) {
      setValue('date', moment(docForEdit.date).format('YYYY-MM-DD'));
    }
    if (docForEdit?.result) {
      setValue('result', docForEdit.result);
    }
    
  }, [docForEdit, setValue]);

  useEffect(() => {
    if(lactations.length > 0) {
      let lactBuf = lactations.find((lact: any) => new Date(lact.startDate) <= new Date(resultDate) && new Date(resultDate) <= (lact.finishDate ? new Date(lact.finishDate) : new Date())) as any | undefined;

      setLactationValue(lactBuf ? lactBuf?.number?.toString() : '');
    }
    
  }, [resultDate]);

  
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
        <FormSection onSubmit={handleSubmit(submit)} title="Результат доения" toEdit={edit} history={!edit ? docHistory : undefined}>

          <BasicInput title='Вес' type='number' insideText={{ frontPlace: false, text: 'л.' }} required={true} error={errors?.result?.message} {...register('result')} />

          <BasicInput title='Дата' type='date' required={true} error={errors?.date?.message} {...register('date')} />

          <Controller name='lactationNumber' control={control} render={({field}) => (
            <Picker title='Номер лактации' required={false} options={lactationOptions} onPick={(picked) => setValue('lactationNumber', parseFloat(picked[0]))} value={[/* docForEdit?.lactationNumber?.toString() || */ lactationValue]} />
          )}></Controller>

          <SubmitButton isLoading={false} isFinished={false}></SubmitButton>
        </FormSection>

      }
    </MainSection>
  )
}

export default MilkingResultForm