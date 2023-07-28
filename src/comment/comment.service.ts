import { Injectable, HttpException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  prisma = new PrismaClient();

  async create(createCommentDto: CreateCommentDto, nguoi_dung_id: number) {
    try {
      const getUserById = await this.prisma.nguoi_dung.findFirst({
        where: { nguoi_dung_id: nguoi_dung_id },
      });
      const getImgById = await this.prisma.hinh_anh.findFirst({
        where: { hinh_id: createCommentDto.hinh_id },
      });
      if (getUserById) {
        if (getImgById) {
          const data = await this.prisma.binh_luan.create({
            data: {
              hinh_id: createCommentDto.hinh_id,
              nguoi_dung_id: nguoi_dung_id,
              ngay_binh_luan: createCommentDto.ngay_binh_luan,
              noi_dung: createCommentDto.noi_dung,
            },
          });
          throw new HttpException(
            {
              mess: {
                data,
                message: 'Comment successful',
                statusCode: 200,
              },
              code: 200,
            },
            200,
          );
        } else {
          throw new HttpException({ mess: 'Image not found', code: 401 }, 401);
        }
      } else {
        throw new HttpException({ mess: 'User not found', code: 401 }, 401);
      }
    } catch (ex) {
      throw new HttpException(
        ex?.response?.mess,
        ex?.status != 500 ? ex.response.code : 500,
      );
    }
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findCmtByImg(hinh_id: number) {
    try {
      const getImgById = await this.prisma.hinh_anh.findFirst({
        where: {
          hinh_id,
        },
      });
      if (getImgById) {
        const data = await this.prisma.binh_luan.findMany({
          where: {
            hinh_id,
          },
        });
        throw new HttpException(
          {
            mess: { data, message: 'Get comments successful', statusCode: 200 },
            code: 200,
          },
          200,
        );
      } else {
        throw new HttpException({ mess: 'Image not found', code: 401 }, 401);
      }
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
