import React, {useCallback} from "react";
import {
  SubmitHandler,
  useForm
} from 'react-hook-form';

const SymptomSurvey: React.FC<{ refresh: SubmitHandler<any> }> = ({refresh}) => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      urine: false,
      thirst: false,
      hunger: false,
      weight_loss: false,
      fatigue: false,
      blurred_vision: false,
      infections: false,
      numbness: false,
      darkened: false,
    }
  });

  return (
    <form onSubmit={handleSubmit(refresh)} style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you urinating often?</label>
        <input type="checkbox" {...register("urine")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you feeling more thirsty than usual?</label>
        <input type="checkbox" {...register("thirst")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you feeling hungrier than usual?</label>
        <input type="checkbox" {...register("hunger")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Have you had unintended weight loss?</label>
        <input type="checkbox" {...register("weight_loss")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you feeling fatigued?</label>
        <input type="checkbox" {...register("fatigue")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you having blurred vision?</label>
        <input type="checkbox" {...register("blurred_vision")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you having frequent infections?</label>
        <input type="checkbox" {...register("infections")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Are you having numbness or tingling in the hands or feet?</label>
        <input type="checkbox" {...register("numbness")}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <label>Do you have areas of darkened skin, usually in the neck or armpits?</label>
        <input type="checkbox" {...register("darkened")}/>
      </div>
      <input type="submit"/>
    </form>
  );
};

export default SymptomSurvey;

// info@rmrbenefits.com
// ATTN: ALYSSA
