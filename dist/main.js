"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const path_1 = require("path");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    };
    app.enableCors(options);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useStaticAssets((0, path_1.resolve)('./src/public'));
    app.setBaseViewsDir((0, path_1.resolve)('./src/views'));
    app.setViewEngine('hbs');
    await app.listen(3000, "0.0.0.0");
}
bootstrap();
//# sourceMappingURL=main.js.map