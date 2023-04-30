import React, { useEffect } from 'react';

import BisFunctionsChart from '../../components/BisFunctionsChart/BisFunctionChart';
import BisMetricsChart from '../../components/BisMetricsChart/BisMetricsChart';
import BisFunctionsContainer from '../BisFunctions/BisFunctionsContainer';
import { AppState } from '../../store/reducer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppAction } from '../../store/actions';

const MonitorAndPlanningContainer = () => {
  // const {from, to} = useSelector((state: AppState) => state.ui.monitoringAndPlanning);
  const bisFunctions = useSelector((state: AppState) => state.bisFunctions);
  const bisMetrics = useSelector((state: AppState) => state.bisMetrics);

  console.log('@bisFunctions');
  console.log(JSON.stringify(bisFunctions, null, 2));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<AppAction>({ type: 'BIS_FUNCTIONS_GET_ALL'});
    dispatch<AppAction>({ type: 'PLAN'});
  }, [dispatch])

  if(bisFunctions === null || bisMetrics === null) {
    return <>Loading</>
  }

  return (
    <>
      <h2>Моніторинг та Планування</h2>
      <BisFunctionsContainer bisFunctions={bisFunctions}/>
      <button>Add new business function</button>
      <hr/>
      <button>Plan</button>
      <BisMetricsChart bisMetricsDto={bisMetrics.balance}/>
      <BisFunctionsChart bisFunctions={bisFunctions.map(x => ({
        ...x,
        periodRange: [x.startPeriod, x.endPeriod ?? 202205]
      }))}/>
    </>
  );
};

export default MonitorAndPlanningContainer;
