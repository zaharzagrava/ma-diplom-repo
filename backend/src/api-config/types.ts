/**
 * @description - config that should always be present in environment variables where application is run
 */
export class EnvConfig {
  node_env: 'local' | 'test' | 'development' | 'staging' | 'production';

  port: number;

  db_port: number;
  db_password: string;
  db_username: string;
  db_name: string;
  db_host: string;

  throttle_api_limit: number;
  throttle_api_ttl: number;

  firebase_client_email: string;
  firebase_private_key: string;
  firebase_project_id: string;

  front_host: string;
  backend_host: string;
}
