import { Controller, Get, Post, Body, HttpStatus, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateUserDto, EmployeeID, UpdatePasswordDto } from '../dtos';
import { JwtAuthGuard } from '../guard/jwt.guard';

@ApiTags('👤 User')
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get('all')
  getAllUser(){
    return this.userService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get A User' })
  @ApiParam({ name: 'Access Token', required: false })
  @Get()
  getUser(@Req() request: Request){ 
    return this.userService.getFullUser(request);
  }

  @ApiOperation({ summary: 'Create A User' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {

      const validatedUser = await this.userService.validateUser(createUserDto);
      const newUser = await this.userService.create(validatedUser);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully!',
        data: newUser,
      };

  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get An Employee' })
  @ApiParam({ name: 'employee_id', required: true })
  @Patch(':employee_id')
  async updatePassword(@Param() id: EmployeeID ,@Body() password: UpdatePasswordDto): Promise<any> {
  
    const new_password = await this.userService.updatePassword(id, password)

      return
        'hello';

  }

}
