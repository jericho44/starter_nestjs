import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UsersService } from '../../modules/users/users.service';

interface UserRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    if (!user) return false;

    const userDetail = await this.usersService.findOne(user.userId);

    if (!userDetail) return false;

    // Check Roles
    if (requiredRoles) {
      const hasRole = requiredRoles.some(
        (role) => userDetail.role.name === role,
      );
      if (hasRole) return true;
    }

    // Check Permissions
    if (requiredPermissions) {
      const userPermissions = userDetail.role.permissions.map(
        (rp) => rp.permission.name,
      );
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );
      if (hasPermission) return true;
    }

    return false;
  }
}
