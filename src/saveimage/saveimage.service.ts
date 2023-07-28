import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSaveimageDto } from './dto/create-saveimage.dto';
import { UpdateSaveimageDto } from './dto/update-saveimage.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SaveimageService {
  prisma = new PrismaClient();
  create(createSaveimageDto: CreateSaveimageDto) {
    return 'This action adds a new saveimage';
  }

  findAll() {
    return `This action returns all saveimage`;
  }

  async findOne(hinh_id: number, nguoi_dung_id: number) {
    const getImgById = await this.prisma.hinh_anh.findFirst({
      where: { hinh_id },
    });
    if (getImgById) {
      const data = await this.prisma.luu_anh.findFirst({
        where: {
          hinh_id,
          nguoi_dung_id,
        },
      });
      if (data) {
        return data;
      } else {
        throw new HttpException('Not saved', 201);
      }
    } else {
      throw new HttpException({ mess: 'Image not found', code: 401 }, 401);
    }
  }

  update(id: number, updateSaveimageDto: UpdateSaveimageDto) {
    return `This action updates a #${id} saveimage`;
  }

  remove(id: number) {
    return `This action removes a #${id} saveimage`;
  }
}
