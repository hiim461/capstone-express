import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  Headers,
  UseGuards,
  HttpStatus,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiHeaders,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hinh_anh } from '@prisma/client';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { SearchImage } from './entities/image.entity';
import { SearchImageDto } from './dto/search-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs/promises';
import * as fs1 from 'fs';
import * as sharp from 'sharp';

class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
  @ApiProperty()
  mo_ta: string;
}
@ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) =>
          callback(null, new Date().getTime() + file.originalname),
      }),
    }),
  )
  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Post('upload-image')
  async upLoadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body() { mo_ta },
  ) {
    const verifyToken = await req['data'];
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!file) {
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      const del = join(process.cwd(), 'public', 'img', file.filename);
      await fs1.unlinkSync(del);
      throw new HttpException('Invalid file extension', HttpStatus.BAD_REQUEST);
    }

    const compressedImagePath = file.path;
    try {
      if (fileExtension !== 'gif') {
        // Sử dụng Sharp để nén ảnh
        const data = await sharp(file.path)
          // .resize({ width: 600 })
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toBuffer();
        fs1.writeFileSync(compressedImagePath, data);
      }

      console.log(file);
      return this.imageService.create(file, +verifyToken?.nguoi_dung_id, mo_ta);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Get()
  async findAll(@Req() req): Promise<hinh_anh[]> {
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.imageService.findAll();
    // if (bearerToken) {
    //   const splitToken = bearerToken.split('Bearer ');
    //   if (splitToken.length === 2) {
    //     const token = splitToken[1];
    //     try {
    //       const verifyToken = await this.jwtService.verifyAsync(token, {
    //         secret: this.configService.get('KEY'),
    //       });
    //       if (verifyToken) {
    //         return this.imageService.findAll();
    //       }
    //     } catch (error) {
    //       if (error instanceof TokenExpiredError) {
    //         throw new HttpException(
    //           'Token has expire',
    //           403,
    //         );
    //       } else {
    //         if (error instanceof JsonWebTokenError) {
    //           throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    //         } else {
    //           throw new HttpException(
    //             'BE error',
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //           );
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // }
  }

  @ApiHeader({ name: 'token' })
  @ApiParam({ name: 'ten_hinh', type: SearchImage })
  @HttpCode(200)
  @Get('search-by-img-name')
  async findAllSearchByName(
    @Query('ten_hinh') ten_hinh: string,
    @Req() req,
  ): Promise<hinh_anh[]> {
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.imageService.findAllSearchByName(ten_hinh);
  }

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Get('saved-image-by-user-id')
  async getSavedImgByUserId(@Req() req) {
    const verifyToken = await req['data'];
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.imageService.getSavedImgByUserId(+verifyToken?.nguoi_dung_id);
  }

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Get('posted-image-by-user-id')
  async getPostedImgByUserId(@Req() req) {
    const verifyToken = await req['data'];
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.imageService.getPostedImgByUserId(+verifyToken?.nguoi_dung_id);
  }

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Get(':hinh_id')
  async findOne(@Param('hinh_id') id: string, @Req() req) {
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.imageService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
  //   return this.imageService.update(+id, updateImageDto);
  // }

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Delete(':hinh_id')
  async remove(@Param('hinh_id') id: string, @Req() req) {
    const verifyToken = await req['data'];
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.imageService.remove(+id, +verifyToken?.nguoi_dung_id);
  }
}
