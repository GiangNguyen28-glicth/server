import { DashBoardService } from './dashboard.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { hasRoles } from 'src/decorators/role.decorators';
import { RolesGuard } from 'src/decorators/role.guard';
import { UserRole } from 'src/User/DTO/user.dto';

@Controller('/dashboard')
export class DashBoardController {
  constructor(private dashboardservice: DashBoardService) {}

  @hasRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @Get('/')
  async getData(): Promise<any> {
    return await this.dashboardservice.getData();
  }
}
