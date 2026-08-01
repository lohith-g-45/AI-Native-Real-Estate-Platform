import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth-identity/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Root endpoint' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Application health check' })
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
  @Get('uploads/media/:filename')
  @Public()
  @ApiOperation({ summary: 'Serve uploaded media' })
  serveMedia(@Param('filename') filename: string, @Res() res: Response) {
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      throw new NotFoundException('Invalid filename');
    }
    const filePath = join(process.cwd(), 'uploads', 'media', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }
    if (!filename.includes('.')) {
      res.set('Content-Type', 'image/jpeg');
    }
    res.sendFile(filePath);
  }
}
