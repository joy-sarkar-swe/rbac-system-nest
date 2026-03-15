/**
 * @fileoverview Cat controller — example feature module demonstrating the boilerplate's response pattern.
 */
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { ServicePayload } from 'src/shared/interfaces/response.interface';
import { CatService } from './cat.service';
import { CatInternalErrorResponseDto } from './dto/error/cat-internal-server-error.dto';
import { GetCatSuccessResponseDto } from './dto/success/cat-success.dto';
import { GetCatResponseDto } from './interfaces/cat.interface';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  /** Retrieve a cat. */
  @ApiOperation({ summary: 'Get Cat' })
  @ApiSuccessResponse(GetCatSuccessResponseDto, 200)
  @ApiErrorResponses({ internal: CatInternalErrorResponseDto })
  @Get()
  async getCat(): Promise<ServicePayload<GetCatResponseDto>> {
    return this.catService.getCat();
  }
}
