import { Controller, Get, Param} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';

@ApiTags('💼 Employee')
@Controller('v1/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'Get Team Member' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async getEmployee(@Param() id): Promise<any> {
      return this.employeeService.getEmployee(id);
  }
}
