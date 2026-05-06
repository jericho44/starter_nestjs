import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AnalyticsPrismaService } from './analytics-prisma.service';

@Global()
@Module({
  providers: [PrismaService, AnalyticsPrismaService],
  exports: [PrismaService, AnalyticsPrismaService],
})
export class PrismaModule {}
