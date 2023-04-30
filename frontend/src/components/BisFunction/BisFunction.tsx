import { Formik, FormikProps } from 'formik';
import React, { FC } from 'react';

import { BisFunctionDto, BisFunctionEditDto, BisFunctionSettings } from '../../store/bis-function.types';
import FormStringField from '../Form/FormStringField/FormStringField';
import { bisFunctionsSettings } from './BisFunctionContainer';

type Props = {
  mode: 'edit' | 'create';

  /**
   * We maintain two separate objects, since they store somewhat different data
   * 
   * bisFunction stores latest snapshot of the bisFunction from the BE
   * bisFunctionEdit stores the data for the /api/bis-function/upsert method
   * 
   * If bisFunction is undefined - we consider that this object is only created (for 'create' mode)
   * 
   * Combining data from both of them, we render the editable component
   */
  bisFunction: BisFunctionDto;
  bisFunctionEdit: BisFunctionEditDto;

  onValidate: (values: BisFunctionEditDto) => any;
  onSubmit: (values: BisFunctionEditDto) => void;
};

const BisFunction: FC<Props> = (params) => {

  const bisFunctionSettings = bisFunctionsSettings[params.bisFunctionEdit.type as keyof BisFunctionSettings]

  if(bisFunctionsSettings[params.bisFunctionEdit.type as keyof typeof bisFunctionsSettings]) {
    return <div style={{
      border: '1px solid black'
    }}>
      <Formik initialValues={params.bisFunctionEdit} enableReinitialize={true} validate={params.onValidate} onSubmit={params.onSubmit}>
        {({ handleSubmit }: FormikProps<BisFunctionEditDto>) => (
          <div>
            <FormStringField name={'name'} placeholder="Function name" label="NAME" editable={false} />
            <FormStringField name={'type'} placeholder="Function type" label="TYPE" editable={false} />
            {bisFunctionSettings && <>
              {Object.entries(bisFunctionSettings.fields).map(([key, value]) => {
                return <FormStringField key={key} name={key} placeholder={value.default} label={value.label}/>
              })}
            </>}

            <button type="submit" onClick={() => handleSubmit()}>
              Update
            </button>
          </div>
        )}
      </Formik>
    </div>
  } 

  switch (params.bisFunctionEdit.type) {
    default:
      break;
  }

  return (
    <h1>Error: No renderer for type {params.bisFunctionEdit.type}</h1>
  );
};

export default BisFunction;
