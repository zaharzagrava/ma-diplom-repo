import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { UserAuthGuard } from '../guards/user-auth.guard';

export function Firewall(options?: {
  anonymous?: boolean;
  throttle?: { limit: number; ttl: number };
  skipThrottle?: boolean;
}) {
  const { throttle, anonymous, skipThrottle } = options || {
    anonymous: false,
  };

  const decorators = [];
  const guards = [];

  // Auth filtering
  if (!anonymous) {
    guards.push(UserAuthGuard);
  }

  decorators.push(UseGuards(...guards));

  if (skipThrottle) {
    decorators.push(SkipThrottle());
  } else if (throttle) {
    decorators.push(Throttle(throttle.limit, throttle.ttl));
  }

  return applyDecorators(...decorators);
}
