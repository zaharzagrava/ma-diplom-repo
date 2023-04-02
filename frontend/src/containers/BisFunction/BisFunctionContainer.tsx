import React, { FC, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { NavigationTabOption } from '../../store/types';
import { AppState } from '../../store/reducer';
import { AppAction } from '../../store/actions';
import Page from '../../components/Page/Page';

type Props = {
  dictionary: any;
}

const BisFunction: FC<Props> = () => {
  const dispatch = useDispatch();
  const { success } = useSelector((state: AppState) => state.actions.getMyself);

  useEffect(() => {
    dispatch<AppAction>({ type: 'GET_MYSELF' });
  }, [dispatch]);

  return (
    <Page>
      <div>
        <h1>Home</h1>
      </div>
    </Page>
  );
};

export default BisFunction;
