import React, { useState, useEffect } from "react";
import MainSection from "../../../../components/MainSection";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import usePPDCall from "../../../../hooks/api/usePPDCall";
import SubmitButton from "../../../../components/inputComponents/SubmitButton";
import FormSection from "../../../../components/inputComponents/FormSection";
import FormConfirmation from "../../../../components/inputComponents/FormConfirmation";
import BasicInput from "../../../../components/inputComponents/BasicInput";
import useGetMilkQualityRecord from "./hooks/useGetMilkQualityRecord";

const MilkQualityForm: React.FC = () => {
  const [dataLoading, setdataLoading] = useState<boolean>(false);
  const [dataSuccess, setdataSuccess] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<any>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const edit = searchParams.get('edit') === 'true';
  const id = searchParams.get('id');

  if (edit && !id) navigate(-1 || '/');

  const { data, isLoading, isSuccess, isError } = useGetMilkQualityRecord(id);
  
  if (edit && !isLoading && !isSuccess) navigate(-1 || '/');

  useEffect(() => {
    if (isSuccess) {
      setEditObj(data?.data?.data?.record);
    }
  }, [data, isSuccess]);

  const schema = yup.object().shape({
    water: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    dryResidue: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    fat: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    casein: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    sugar: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    phosphatides: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    sterols: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    albumen: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    otherProteins: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    nonProteinCompounds: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    saltsOfInorganicAcids: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    ash: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    pigments: yup
    .number()
    .nullable()
    .transform((value) => (value ? parseFloat(value.toString().replace(',', '.')) : null))
    .test('is-number', 'Введите корректное число', (value) => value === null || !isNaN(value as number)),
    date: yup.string().required('Укажите дату').test(
      'valid-date',
      'Укажите правильную дату',
      (value) => {
        const parsedDate = value ? new Date(value) : null;
        if (!parsedDate || isNaN(parsedDate.getTime())) return false;

        if (parsedDate > new Date()) return false;

        return true;
      }
    )
  }).test('at-least-one-filled', 'Хотя бы одно поле должно быть заполнено', (values) => {
    return Object.entries(values).some(([key, value]) =>
      key !== 'date' && value !== null && value !== undefined && value !== ''
    );
  });;

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema), defaultValues: {
      date: editObj?.date
        ? moment(editObj.date).format('YYYY-MM-DD')
        : '',
      water: editObj?.water || null,
      dryResidue: editObj?.dryResidue || null,
      fat: editObj?.fat || null,
      casein: editObj?.casein || null,
      sugar: editObj?.sugar || null,
      phosphatides: editObj?.phosphatides || null,
      sterols: editObj?.sterols || null,
      albumen: editObj?.albumen || null,
      otherProteins: editObj?.otherProteins || null,
      nonProteinCompounds: editObj?.nonProteinCompounds || null,
      saltsOfInorganicAcids: editObj?.saltsOfInorganicAcids || null,
      ash: editObj?.ash || null,
      pigments: editObj?.pigments || null,
    }
  });


  useEffect(() => {
    if (editObj?.date) setValue('date', moment(editObj.date).format('YYYY-MM-DD'));
    if (editObj?.water) setValue('water', editObj.water);
    if (editObj?.dryResidue) setValue('dryResidue', editObj.dryResidue);
    if (editObj?.fat) setValue('fat', editObj.fat);
    if (editObj?.casein) setValue('casein', editObj.casein);
    if (editObj?.sugar) setValue('sugar', editObj.sugar);
    if (editObj?.phosphatides) setValue('phosphatides', editObj.phosphatides);
    if (editObj?.sterols) setValue('sterols', editObj.sterols);
    if (editObj?.albumen) setValue('albumen', editObj.albumen);
    if (editObj?.otherProteins) setValue('otherProteins', editObj.otherProteins);
    if (editObj?.nonProteinCompounds) setValue('nonProteinCompounds', editObj.nonProteinCompounds);
    if (editObj?.saltsOfInorganicAcids) setValue('saltsOfInorganicAcids', editObj.saltsOfInorganicAcids);
    if (editObj?.ash) setValue('ash', editObj.ash);
    if (editObj?.pigments) setValue('pigments', editObj.pigments);

  }, [editObj, setValue]);

  const type = !edit ? 'post' : 'patch';
  const url = !edit ? `/api/milk/quality/` : `/api/milk/quality/${id}`;
  const { mutate, status, error, data: resData } = usePPDCall({ type, url });
  const onSubmit = (data: any) => {
    setdataLoading(true);

    const formattedData = {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
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

  return (
    <MainSection block="herd">
      {dataSuccess && <FormConfirmation />}
      {!isLoading && !dataSuccess &&
        <FormSection onSubmit={handleSubmit(onSubmit)} title="Качество молока" toEdit={edit}>

          <div className="ai-input-table-block">
            <div className="ai-input-label">Таблица качества (в %)</div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Вода</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('water')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Жир</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('fat')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Сухой остаток</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('dryResidue')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Казеин</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('casein')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Сахар</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('sugar')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Фосфатиды</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('phosphatides')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Стерин</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('sterols')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Альбумин</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('albumen')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Другие белки</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('otherProteins')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Небелковые соединения</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('nonProteinCompounds')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Соли неорган. кислот</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('saltsOfInorganicAcids')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Зола</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('ash')} />
            </div>

            <div className="ai-table-line">
              <div className="ai-table-line-text">Пигменты</div>
              <input className="ai-table-line-input" type="number" step="any" {...register('pigments')} />
            </div>


          </div>

          <BasicInput title="Дата" type="date" required={true} error={errors?.date?.message} {...register('date')}></BasicInput>

          <SubmitButton isLoading={dataLoading} isFinished={dataSuccess}></SubmitButton>
        </FormSection>
      }
    </MainSection>
  )
}

export default MilkQualityForm;