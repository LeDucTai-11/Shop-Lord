import { CanActivate, ExecutionContext, Type, mixin } from "@nestjs/common";
import { Role } from "src/core/enum/roles.enum";
import { JwtAuthGuard } from "../jwt/jwt.guard";


const RoleGuard = (role: Role) : Type<CanActivate> => {
    class RoleGuardMixin extends JwtAuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);
            const request = context.switchToHttp().getRequest<any>();
            const user = request.user;
            let passGuard = false;
            if(user.userRoles) {
                user.userRoles.forEach((element) => {
                    if(element.roleId === role) {
                        passGuard = true;
                        return;
                    }
                });
            }
            return passGuard;
        }
    }
    return mixin(RoleGuardMixin);
}
export default RoleGuard;