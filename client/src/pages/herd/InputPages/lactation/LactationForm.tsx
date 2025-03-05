import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import moment from 'moment';
import MainSection from '../../../../components/MainSection';
import FormSection from '../../../../components/inputComponents/FormSection';
import useGetOneAnimal from '../../../../hooks/useGetOneAnimal';
import BasicInput from '../../../../components/inputComponents/BasicInput';
import SubmitButton from '../../../../components/inputComponents/SubmitButton';
import Picker from '../../../../components/inputComponents/Picker';
import usePPDCall from '../../../../hooks/api/usePPDCall';
import FormConfirmation from '../../../../components/inputComponents/FormConfirmation';
import useLactationData from './hooks/useLactationData';
import Loader from '../../../../components/otherComponents/loader/Loader';

const LactationForm: React.FC = () => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataSuccess, setDataSuccess] = useState<boolean>(false);

  const [searchParams] = useSearchParams();

  const { id } = useParams();

  const edit = searchParams.get('edit') === 'true';
  const lactId = searchParams.get('id');

  const { data, isLoading, isSuccess, isError, error } = useGetOneAnimal(id!);

  const { unfinishedLact, lactHistory, lactNumberOptions, url, lactForEdit, otherLacts } = useLactationData(data, lactId, edit);

  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoading && !isSuccess || edit && !lactId) navigate(-1 || '/');

  const schema = yup.object().shape({
    startDate: yup
      .string()
      .required('Введите дату начала лактации')
      .test(
        'valid-format',
        'Введите дату в формате ГГГГ-ММ-ДД',
        (value) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) // Validate "YYYY-MM-DD" format
      )
      .test(
        'valid-date',
        'Введите правильную дату начала лактации',
        (value) => {
          const parsedDate = value ? new Date(value) : null;
          if (!parsedDate || isNaN(parsedDate.getTime())) return false;

          // Check against other lactation dates
          return otherLacts.every((lact: any) => {
            const startDate = new Date(lact.startDate);
            const finishDate = lact.finishDate ? new Date(lact.finishDate) : new Date();
            return parsedDate < startDate || parsedDate > finishDate;
          });
        }
      )
      .test(
        'max-date',
        'Дата начала лактации не может быть в будущем',
        (value) => {
          const parsedDate = value ? new Date(value) : null;
          return parsedDate ? parsedDate <= new Date() : true;
        }
      ),
    finishDate: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        'valid-format',
        'Введите дату в формате ГГГГ-ММ-ДД',
        (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) // Validate "YYYY-MM-DD" format
      )
      .test(
        'min-date',
        'Дата окончания лактации должна быть позже начала',
        (value, context) => {
          if (!value) return true;
          const parsedFinishDate = new Date(value);
          const parsedStartDate = new Date(context.parent.startDate);
          return parsedFinishDate > parsedStartDate;
        }
      ),
    number: yup.number().required('Введите номер лактации'),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: lactForEdit?.startDate
        ? moment(lactForEdit.startDate).format('YYYY-MM-DD')
        : '',
      finishDate: lactForEdit?.finishDate
        ? moment(lactForEdit.finishDate).format('YYYY-MM-DD')
        : '',
      number: lactForEdit?.number || null,
    },
  });

  // Set values for the inputs
  useEffect(() => {
    if (lactForEdit?.startDate) {
      setValue('startDate', moment(lactForEdit.startDate).format('YYYY-MM-DD'));
    }
    if (lactForEdit?.finishDate) {
      setValue('finishDate', moment(lactForEdit.finishDate).format('YYYY-MM-DD'));
    }
  }, [lactForEdit, setValue]);

  const type = !edit ? 'post' : 'patch';
  const { mutate, onSuccess, status } = usePPDCall({ type, url });

  // Submit handler
  const submit = (data: any) => {
    setDataLoading(true);
    // Convert strings back to Date objects for backend submission
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate),
      finishDate: data.finishDate ? new Date(data.finishDate) : undefined,
      _id: lactId ? lactId : undefined
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
      {dataSuccess && <FormConfirmation/>}
      {isSuccess && !dataSuccess &&
        <FormSection onSubmit={handleSubmit(submit)} title="Лактацию" toEdit={edit} history={!edit ? lactHistory : undefined}>

          {!edit && unfinishedLact &&
            <div className='ai-detail-info-block'>
              <div className='ai-input-label'>Неоконченная лактация</div>
              <div className='ai-di-indicator'>
                <div className='ai-di-indicator-inner ai-di-indicator-inner-1'></div>
                <div className='ai-di-indicator-inner ai-di-indicator-inner-2'></div>
                <div className='ai-di-indicator-inner ai-di-indicator-inner-3'></div>
              </div>
              <div className='ai-di-text'>Лактация #{unfinishedLact?.number}</div>
              <div className='ai-di-date'>{`${moment(unfinishedLact?.startDate).locale('ru').format('DD MMM YY').toLowerCase()}`}</div>
            </div>
          }

          <BasicInput title='Начало' type='date' required={true} error={errors?.startDate?.message} {...register('startDate')} />
          <BasicInput title='Окончание' type='date' required={false} error={errors?.finishDate?.message} {...register('finishDate')} />

          <Controller name='number' control={control} render={({ field }) => (<Picker title='Номер лактации' required={false} options={lactNumberOptions} onPick={(picked) => setValue('number', parseFloat(picked[0]))} value={[lactForEdit?.number?.toString()]} />)}></Controller>

          <SubmitButton isLoading={false} isFinished={false}></SubmitButton>
        </FormSection>

      }
    </MainSection>
  )
}

export default LactationForm