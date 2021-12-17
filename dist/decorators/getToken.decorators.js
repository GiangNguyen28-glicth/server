"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetToken = void 0;
const common_1 = require("@nestjs/common");
exports.GetToken = (0, common_1.createParamDecorator)(async (data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.headers.authorization.split(" ")[1];
});
//# sourceMappingURL=getToken.decorators.js.map