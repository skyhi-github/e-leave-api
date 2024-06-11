import { Controller, Post, Body, Get, Param} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../dtos';
import { EmployeeService } from '../services/employee.service';

@ApiTags('👥 Employee')
@Controller('v1/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'Create An Employee' })
  @Post()
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<any> {
      return this.employeeService.create(createEmployeeDto);
  }

  @ApiOperation({ summary: 'Get An Employee' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async getEmployee(@Param() id): Promise<any> {
      return this.employeeService.getEmployee(id);
  }
}

