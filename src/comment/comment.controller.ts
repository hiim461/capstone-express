import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @ApiBody({ description: 'comment info', type: Comment })
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const verifyToken = await req['data'];
    if (!req['authenticated']) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.commentService.create(createCommentDto, +verifyToken?.nguoi_dung_id);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @ApiHeader({ name: 'token' })
  @HttpCode(200)
  @Get(':hinh_id')
  findCmtByImg(@Param('hinh_id') hinh_id: string) {
    return this.commentService.findCmtByImg(+hinh_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
