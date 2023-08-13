import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../store/reducer';
import { AppAction } from '../../store/actions';
import Page from '../../components/Page/Page';

const HomeContainer = () => {
  return (
    <h1>Home</h1>
  );
};

export default HomeContainer;
