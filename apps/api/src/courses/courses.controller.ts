import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.coursesService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  create(@Body() dto: CreateCourseDto, @CurrentUser() user: any) {
    return this.coursesService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCourseDto>, @CurrentUser() user: any) {
    return this.coursesService.update(id, dto, user.id);
  }

  @Post(':id/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  createModule(@Param('id') id: string, @Body() dto: CreateModuleDto, @CurrentUser() user: any) {
    return this.coursesService.createModule(id, dto, user.id);
  }

  @Post('modules/:moduleId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  createLesson(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto, @CurrentUser() user: any) {
    return this.coursesService.createLesson(moduleId, dto, user.id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  enroll(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.enroll(id, user.id);
  }

  @Get('my/enrollments')
  @UseGuards(JwtAuthGuard)
  myEnrollments(@CurrentUser() user: any) {
    return this.coursesService.myEnrollments(user.id);
  }
}
