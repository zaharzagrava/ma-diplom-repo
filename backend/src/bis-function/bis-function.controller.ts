import {
  Body,
  Controller,
  Get,
  Injectable,
  Logger,
  Post,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import BisFunction, { BisFunctionType } from 'src/models/bis-function.model';
import Product from 'src/models/product.model';
import Resource from 'src/models/resource.model';
import Equipment from 'src/models/equipment.model';
import { BisFunctionService } from './bis-function.service';
import { Firewall } from 'src/auth/decorators/firewall.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/decorators/user.decorator';
import { UserRawDto } from 'src/users/types';
import { BisFunctionUpsertDto } from './bis-function.types';

@ApiTags('bis-function')
@Controller('bis-function')
export class BisFunctionController {
  private readonly logger = new Logger(BisFunctionController.name);

  constructor(
    private readonly bisFunctionService: BisFunctionService,

    @InjectModel(BisFunction)
    private readonly bisFunctionModel: typeof BisFunction,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(Resource)
    private readonly resourceModel: typeof Resource,
    @InjectModel(Equipment)
    private readonly equipmentModel: typeof Equipment,
    @InjectConnection() private readonly sequelizeInstance: Sequelize,
  ) {}

  @Firewall()
  @Get('/')
  public async findAll() {
    return await this.bisFunctionService.findAll();
  }

  @Firewall()
  @Post('/upsert')
  public async upsert(
    @User() user: UserRawDto,
    @Body() params: BisFunctionUpsertDto,
  ) {
    console.log('--- /api/bis-function/upsert');

    console.log('@params');
    console.log(params);

    return await this.bisFunctionService.upsert({
      bisFunctionUpsert: params,
    });
  }
}
