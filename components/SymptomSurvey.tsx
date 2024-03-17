import React, {useCallback} from "react";
import {
  useForm
} from 'react-hook-form';
import {FoodProps, SymptomProps} from "./Post";


// export type FoodProps = {
//   id: string;
//   name: string;
//   createdAt: string;
//   author: {
//     name: string;
//     email: string;
//   } | null;
// };
//
// export type SymptomProps = {
//   id: string;
//   name: string;
//   userId: string;
// };

const SymptomSurvey: React.FC<{ refresh: Function }> = ({refresh}) => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      urine: "",
      thirst: ""
    }
  });

  const submitFunction = useCallback(async (data) => {
    console.log({data})
    try {
      const res = await fetch('/api/symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 200){
        refresh()
      }

    } catch (error) {
      console.error(error);
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(submitFunction)} style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you urinating often?</label>
        <input type="checkbox" {...register("urine")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you feeling more thirsty than usual?</label>
        <input type="checkbox" {...register("thirst")}/>
      </div>
      <input type="submit"/>
    </form>
  );
};

export default SymptomSurvey;
