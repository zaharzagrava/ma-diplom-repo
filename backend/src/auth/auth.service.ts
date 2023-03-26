import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import User from 'src/models/user.model';
import { FirebaseService } from 'src/firebase/firebase.service';
import { InjectModel } from '@nestjs/sequelize';
import { ApiConfigService } from 'src/api-config/api-config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private firebaseService: FirebaseService,
    private configService: ApiConfigService,
  ) {}

  /**
   * @description - Validates User Auth token
   *
   * @returns
   */
  public async userAuthentication(userAuthToken?: string): Promise<User> {
    try {
      if (!userAuthToken) {
        throw new UnauthorizedException('User auth token is not provided');
      }

      const idToken = await this.firebaseService.fbAuth.verifyIdToken(
        userAuthToken,
      );

      if (
        this.configService.get('node_env') === 'production' &&
        idToken.firebase.sign_in_provider === 'custom'
      ) {
        throw new BadRequestException(
          'Custom generated tokens are not allowed on production',
        );
      }

      if (!idToken.email) {
        throw new BadRequestException(
          'Email is unavailable in decoded user auth token',
        );
      }

      const user = await this.userModel.findOne({
        where: {
          email: idToken.email,
        },
        raw: true,
      });

      if (!user) {
        throw new NotFoundException(
          `User with this email is not found ${idToken.email}`,
        );
      }

      return user;
    } catch (error) {
      if (
        error.code === 'auth/id-token-expired' ||
        (error.code === 'auth/argument-error' &&
          error.errorInfo.message.includes(
            'Most likely the ID token is expired',
          ))
      ) {
        throw new UnauthorizedException(
          'This user auth token is invalid for some reason, most likely expired',
        );
      } else if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unexpected error with authentication has happened',
      );
    }
  }
}
