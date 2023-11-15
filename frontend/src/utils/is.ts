
export const LOCALHOST = 'localhost';
export const DEV_HOST_IDENTIFIER = 'ma-diplom-dev.eba-b3ww3qqu.us-east-1.elasticbeanstalk.com';

export const is = {
  localhost: window.location.hostname.includes(LOCALHOST),
  dev: window.location.hostname.includes(DEV_HOST_IDENTIFIER),
};
