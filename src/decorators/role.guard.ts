import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "../User/Schema/User.Schema";
import { UserService } from "../User/User.service";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const methodkey= context.getHandler();
        console.log(methodkey);
        if (!roles) {
            return true;
        }
        console.log(roles)
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        return roles.some((role) => user.role?.includes(role));
    }
}