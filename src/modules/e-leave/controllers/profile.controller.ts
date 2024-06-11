import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateProfileDto } from '../dtos/profile.dto';

@ApiTags('😃  Profile')
@Controller('v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Create A Profile' })
  @Post()
  createProfile(@Body() createProfileDto: CreateProfileDto){
    return this.profileService.createProfile(createProfileDto);
  }

  @ApiOperation({ summary: 'Get A Profile' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  getProfile(@Param() id): Promise<any> {
    return this.profileService.getProfile(id);
  }
}
