import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import User from 'src/models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([User]), FirebaseModule],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [],
})
export class AuthModule {}
