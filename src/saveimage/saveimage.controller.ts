import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SaveimageService } from './saveimage.service';
import { CreateSaveimageDto } from './dto/create-saveimage.dto';
import { UpdateSaveimageDto } from './dto/update-saveimage.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('save-image')
@Controller('save-image')
export class SaveimageController {
  constructor(private readonly saveimageService: SaveimageService) {}

  @Post()
  create(@Body() createSaveimageDto: CreateSaveimageDto) {
    return this.saveimageService.create(createSaveimageDto);
  }

  @Get()
  findAll() {
    return this.saveimageService.findAll();
  }

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Get(':hinh_id')
  async findOne(@Param('hinh_id') hinh_id: string, @Req() req) {
    const verifyToken = await req['data'];
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.saveimageService.findOne(
      +hinh_id,
      +verifyToken?.nguoi_dung_id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaveimageDto: UpdateSaveimageDto,
  ) {
    return this.saveimageService.update(+id, updateSaveimageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saveimageService.remove(+id);
  }
}
