import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): { userId: string; email: string; role: string } => {
    const request = ctx.switchToHttp().getRequest<{ user: { userId: string; email: string; role: string } }>();
    return request.user;
  },
);
