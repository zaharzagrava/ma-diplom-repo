import Axios from 'axios'
import { Config } from '../config';
import { firebaseAuth } from '../firebase';

export class InterceptorService {
  public static init(appConfig: Config): void {
    Axios.defaults.baseURL = `${appConfig.host}${appConfig.apiBaseUrl}`;

    InterceptorService.addRequestInterceptor();
  }

  private static requestInterceptorId = -1;

  private static addRequestInterceptor(): void {
    if (InterceptorService.requestInterceptorId === -1) {
      InterceptorService.requestInterceptorId = Axios.interceptors.request.use(
        async (axiosConfig) => {
          const token = await firebaseAuth.currentUser?.getIdToken();
          axiosConfig.headers['x-user-token'] = token;
          return axiosConfig;
        },
      );
    }
  }
}
