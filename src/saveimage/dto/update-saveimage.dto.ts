import { PartialType } from '@nestjs/swagger';
import { CreateSaveimageDto } from './create-saveimage.dto';

export class UpdateSaveimageDto extends PartialType(CreateSaveimageDto) {}
