import React, {useState} from "react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {useForm, Controller} from 'react-hook-form';

const VetAction: React.FC = () => {
  const [dataLoading, setdataLoading] = useState<boolean>(false);
  const [dataSuccess, setdataSuccess] = useState<boolean>(false);

  return (
    <div>Vet Action</div>
  )
}

export default VetAction;