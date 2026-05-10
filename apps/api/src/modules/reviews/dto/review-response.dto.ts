import { ApiProperty } from '@nestjs/swagger';

class ReviewUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

export class ReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({ nullable: true })
  body: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: ReviewUserDto })
  user: ReviewUserDto;
}
