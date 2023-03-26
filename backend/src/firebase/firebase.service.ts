import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as auth from 'firebase-admin/auth';
import { ApiConfigService } from 'src/api-config/api-config.service';

@Injectable()
export class FirebaseService {
  private fbApp: admin.app.App;

  public fbAuth: auth.Auth;

  constructor(private readonly configService: ApiConfigService) {
    this.fbApp = admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: this.configService.get('firebase_client_email'),
        privateKey: this.configService.get('firebase_private_key'),
        projectId: this.configService.get('firebase_project_id'),
      }),
    });

    this.fbAuth = this.fbApp.auth();
  }
}
