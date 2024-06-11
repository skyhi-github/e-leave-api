import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { TeamService } from '../services/team.service';

@ApiTags('👥  Team')
@Controller('v1/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Get A Profile' })
  @ApiParam({ name: 'department_name', required: true })
  @Get(':department_name')
  getProfile(@Param() department_name): Promise<any> {
    return this.teamService.getProfileByDepartment(department_name);
  }
}
