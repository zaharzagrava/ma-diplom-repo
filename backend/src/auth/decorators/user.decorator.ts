import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRawDto } from 'src/users/types';

export const User: () => ParameterDecorator = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request: { user: UserRawDto } = ctx.switchToHttp().getRequest();
    return request.user || null;
  },
);
