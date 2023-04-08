import React, { useEffect } from 'react';

import BisFunctionsChart from '../../components/BisFunctionsChart/BisFunctionChart';
import BisMetricsChart from '../../components/BisMetricsChart/BisMetricsChart';
import BisFunctionsContainer from '../BisFunctions/BisFunctionsContainer';
import { AppState } from '../../store/reducer';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import { AppAction } from '../../store/actions';

const MonitorAndPlanningContainer = () => {
  // const {from, to} = useSelector((state: AppState) => state.ui.monitoringAndPlanning);
  const bisFunctions = useSelector((state: AppState) => state.bisFunctions);
  const bisMetrics = useSelector((state: AppState) => state.bisMetrics);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('@dispatch plan');
    dispatch<AppAction>({ type: 'PLAN_ALPHA_BETA'});
  }, [dispatch])

  if(bisFunctions === null || bisMetrics === null) {
    return <>Loading</>
  }

  return (
    <>
      <h2>Моніторинг та Планування</h2>
      <BisFunctionsContainer bisFunctions={bisFunctions}/>
      <button>Plan</button>
      <BisMetricsChart bisMetricsDto={[]}/>
      <BisFunctionsChart bisFunctions={bisFunctions}/>
    </>
  );
};

export default MonitorAndPlanningContainer;
