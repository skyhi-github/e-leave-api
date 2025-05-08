import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PhotoService } from '../services/photo.service';
import { CreatePhotoDto } from '../dto/create-photo.dto';

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  async findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }

  @Post()
  async create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photoService.create(createPhotoDto);
  }
}