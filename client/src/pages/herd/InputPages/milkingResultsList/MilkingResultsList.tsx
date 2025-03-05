import React, { useEffect, useState } from "react";
import useGetCowsWithLacts from "../../../../hooks/useGetCowsWithLact";
import * as yup from 'yup';
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MainSection from "../../../../components/MainSection";
import FormConfirmation from "../../../../components/inputComponents/FormConfirmation";
import moment from "moment";
import useMultiplePPDCalls from "../../../../hooks/api/useMultiplePPDCalls";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../../components/otherComponents/loader/Loader";

const MilkingResultsList: React.FC = () => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataSuccess, setDataSuccess] = useState<boolean>(false);
  const [animals, setAnimals] = useState<any[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<any[]>([]);
  const [triggerRender, setTriggerRender] = useState<boolean>(false);
  const [emptyError, setEmptyError] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isSuccess } = useGetCowsWithLacts();

  useEffect(() => {
    if (isSuccess) {
      setAnimals(data?.data?.cows);
      setFilteredAnimals(data?.data?.cows);
    }
  }, [data, isSuccess]);

  const schema = yup.object().shape({
    date: yup.string().required('Введите дату').test(
      'valid-date',
      'Введите правильную дату',
      (value) => {
        const parsedDate = value ? new Date(value) : null;

        return !parsedDate || isNaN(parsedDate.getTime()) || new Date() < parsedDate ? false : true
      }),
    forms: yup.array().of(yup.object({
      animalId: yup.string().nullable().notRequired(),
      result: yup.string().nullable().notRequired(),
      lactationNumber: yup.number().nullable().notRequired(),
      note: yup.string().nullable().notRequired()
    })).required().min(1, 'Добавьте минимум один результат')
  });

  const { register, control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'forms'
  });

  useEffect(() => {
    if (isSuccess) {
      animals.forEach((cow: any) => {
        const alreadyExists = fields.some((field: any) => field.animalId === cow._id)
        if (!alreadyExists) append({ animalId: cow._id, result: undefined, lactationNumber: undefined, note: undefined }, { shouldFocus: false });
      });
    }
  }, [animals]);

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);

    if (!date) return;

    fields.forEach((field: any, index: number) => {
      const animal: any = animals.find((animal: any) => animal._id === field.animalId);
      const lactation = animal?.lactations?.find((lact: any) => new Date(lact.startDate) <= date && date <= (lact.finishDate ? new Date(lact.finishDate) : new Date()));

      if (!lactation) return;
      field.lactationNumber = lactation.number;
      setValue(`forms.${index}.lactationNumber`, lactation.number);
    });

    setTriggerRender((prev) => !prev); // Trigger a single render update

  }

  /* Search animals */
  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    const filtered = animals
      .slice()
      .sort((a: any, b: any) => {
        const aMatches = a.number.includes(value) || a.name?.toLowerCase().includes(value);
        const bMatches = b.number.includes(value) || b.name?.toLowerCase().includes(value);

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });

    setFilteredAnimals(filtered);
  };

  const { mutate } = useMultiplePPDCalls({ type: 'post' });

  const submit = (data: any) => {
    setDataLoading(true);

    const formatedDate = new Date(data.date);

    const validForms = data.forms.filter((form: any) => form.result && form.result.length > 0 && form.lactationNumber).map((form: any) => ({
      ...form,
      result: parseFloat(form.result),
    }));

    if (validForms.length === 0) {
      setDataLoading(false);
      setEmptyError(true);
      return;
    }
    setEmptyError(false)

    const reqData = validForms.map((form: any) => {
      return {
        url: `/api/animals/milking/${form.animalId}`,
        data: {
          ...form,
          date: formatedDate,
          animalId: undefined
        }
      }
    });

    mutate(reqData, {
      onSuccess: () => {
        setDataSuccess(true);

        setTimeout(() => {
          navigate(location.pathname + location.search);
        }, 2000)
      }
    })

  }

  if (isLoading) return <Loader/>;

  return (
    <MainSection block="herd">

      {dataSuccess && <FormConfirmation />}

      {isSuccess && !dataSuccess &&
        <form className="ai-list-container" onSubmit={handleSubmit(submit)} >
          <div className="ai-block-sub-title">ДОБАВИТЬ</div>
          <div className="ai-block-title">Результаты доения</div>

          <div className="ai-list-header">
            <input type="date" className="ai-list-header-date" {...register('date')} onChange={onChangeDate} style={{ border: `${errors?.date ? '1.5px solid #d44d5c' : 'none'}` }} />
            <input type="text" className="ai-list-header-search" placeholder="Номер или кличка животного" onChange={onSearch} />
            <button type="submit" className="ai-input-submit-btn ai-list-header-btn">
              {dataLoading
                ?
                <div style={{ width: '15px', height: '15px' }} className="loading-icon"></div>
                :
                'Сохранить'
              }

            </button>
          </div>

          <div className="ai-box-list-header">
            <div className="ail-header-text ail-item-number">Номер  </div>
            <div className="ail-header-text ail-item-name">Кличка</div>
            <div className="ail-header-text ail-item-result">Результат</div>
            <div className="ail-header-text ail-item-lact-number">Лактации</div>
            <div className="ail-header-text ail-item-result ail-result-note">Заметка</div>
          </div>

          <div className="ai-box-list" style={{ border: `${emptyError ? '1.5px solid #d44d5c' : 'none'}` }}>
            {filteredAnimals.map((animal: any, ai: number) => {
              const field = fields.find((field: any) => field.animalId === animal._id);

              if (!field) return;

              animal?.lactations?.sort((a: any, b: any) => a.number - b.number);

              return (
                <div key={ai} className="ai-list-item">
                  <div className="ail-part ail-item-number">#{animal?.number}</div>
                  <div className="ail-part ail-item-name">{animal?.name ? animal.name : '-'}</div>
                  <div className="ail-part ail-item-result">
                    <input type="number" className="ail-input" {...register(`forms.${fields.indexOf(field)}.result`)} />
                    <div className="ail-unit">л.</div>
                  </div>
                  <div className="ail-part ail-item-lact-number">
                    {animal?.lactations?.map((lact: any, li: number) => (
                      <div key={li} className={`ail-small-lact ${lact.number === field.lactationNumber ? 'ail-small-lact-active' : ''}`} data-value={lact.number}>{lact.number}</div>
                    ))}
                  </div>
                  <div className="ail-item-result ail-result-note">
                    <input type="text" className="ail-input" {...register(`forms.${fields.indexOf(field)}.note`)} />
                  </div>

                </div>
              )
            })}
          </div>

        </form>
      }

    </MainSection>
  )
};

export default MilkingResultsList;