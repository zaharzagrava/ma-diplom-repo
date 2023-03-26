import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../store/reducer';
import { AppAction } from '../../store/actions';
import Page from '../../components/Page/Page';
import router from '../../router';
import { firebaseAuth } from '../../firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { InterceptorService } from '../../services/Interceptors';
import { config } from '../../config';

const AppContainer = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: AppState) => state);

  useEffect(()=> {
    InterceptorService.init(config);

		onAuthStateChanged(firebaseAuth, async (userCred) => {
      if (!userCred) {
        signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
      } else if (state.actions.getMyself.success === null) {
        dispatch<AppAction>({ type: 'GET_MYSELF' });
      }
		});
  }, [dispatch, state.actions.getMyself.success]);

  if(state.actions.getMyself.success === null) {
    return <div>Loading</div>
  }

  if(state.actions.getMyself.success === false) {
    return <div>There has been an error with login, you will be signed out and send to login again</div>
  }

  return (
    <Page>
      <div>
        <h1>App</h1>
      </div>
    </Page>
  );
};

export default AppContainer;
