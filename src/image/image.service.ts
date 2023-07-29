import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaClient, hinh_anh } from '@prisma/client';

@Injectable()
export class ImageService {
  prisma = new PrismaClient();
  async create(file: Express.Multer.File, userId: number, mo_ta: string) {
    try {
      const getUserById = await this.prisma.nguoi_dung.findFirst({
        where: { nguoi_dung_id: userId },
      });
      if (getUserById) {
        const data = await this.prisma.hinh_anh.create({
          data: {
            ten_hinh: file.filename,
            duong_dan: file.path,
            nguoi_dung_id: userId,
            mo_ta,
          },
        });
        throw new HttpException(
          {
            mess: {
              data,
              message: 'Upload image successful',
              sttatusCode: 200,
            },
            code: 200,
          },
          200,
        );
      }
      throw new HttpException({ mess: 'User not found', code: 401 }, 401);
    } catch (ex) {
      throw new HttpException(
        ex.response?.mess,
        ex?.status != 500 ? ex?.response?.code : 500,
      );
    }
  }

  async findAllSearchByName(ten_hinh: string): Promise<hinh_anh[]> {
    try {
      const data = await this.prisma.hinh_anh.findMany({
        where: {
          ten_hinh: {
            contains: ten_hinh,
          },
        },
      });

      throw new HttpException(
        { mess: { data, message: 'Successful', statusCode: 200 }, code: 200 },
        200,
      );
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  async findAll(): Promise<hinh_anh[]> {
    try {
      const data = await this.prisma.hinh_anh.findMany();
      throw new HttpException(
        { mess: { data, message: 'Successful', statusCode: 200 }, code: 200 },
        200,
      );
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  async getSavedImgByUserId(userId: number) {
    try {
      const data = await this.prisma.luu_anh.findMany({
        where: {
          nguoi_dung_id: userId,
        },
        include: {
          hinh_anh: true,
        },
      });
      const data1 = data.map((item) => item.hinh_anh);
      throw new HttpException(
        {
          mess: { data: data1, message: 'Successful', statusCode: 200 },
          code: 200,
        },
        200,
      );
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  async getPostedImgByUserId(userId: number) {
    try {
      const data = await this.prisma.hinh_anh.findMany({
        where: {
          nguoi_dung_id: userId,
        },
      });
      // const data1 = data.map((item) => item.hinh_anh);
      throw new HttpException(
        {
          mess: { data: data, message: 'Successful', statusCode: 200 },
          code: 200,
        },
        200,
      );
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.hinh_anh.findFirst({
        where: {
          hinh_id: id,
        },
        include: {
          nguoi_dung: true,
        },
      });
      throw new HttpException(
        { mess: { data, message: 'Successful', statusCode: 200 }, code: 200 },
        200,
      );
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  async remove(id: number, userId: number) {
    try {
      const img = await this.prisma.hinh_anh.findUnique({
        where: { hinh_id: id },
      });
      if (!img) {
        throw new HttpException({ mess: 'Image not found', code: 404 }, 404);
      } else {
        if (img.nguoi_dung_id === userId) {
          const data = await this.prisma.hinh_anh.delete({
            where: { hinh_id: id },
          });
          throw new HttpException(
            {
              mess: {
                data,
                message: 'Delete image successful',
                statusCode: 200,
              },
              code: 200,
            },
            200,
          );
        } else {
          throw new HttpException(
            {
              mess: 'You do not have permission to delete this image',
              code: HttpStatus.FORBIDDEN,
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }
}
