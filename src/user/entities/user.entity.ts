import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty()
    email: string;
    @ApiProperty()
    mat_khau:string;
    @ApiProperty()
    ho_ten: string;
    @ApiProperty()
    tuoi: number;
    @ApiProperty()
    anh_dai_dien: string;
}
