import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: { teacher: { select: { id: true, name: true, avatar: true } }, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        teacher: { select: { id: true, name: true, avatar: true } },
        category: true,
        modules: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
      },
    });
    if (!course) throw new NotFoundException('Curso não encontrado');
    return course;
  }

  async create(dto: CreateCourseDto, teacherId: string) {
    return this.prisma.course.create({
      data: { ...dto, teacherId },
    });
  }

  async update(id: string, dto: Partial<CreateCourseDto>, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Curso não encontrado');
    if (course.teacherId !== userId) throw new ForbiddenException('Sem permissão');
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async createModule(courseId: string, dto: CreateModuleDto, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso não encontrado');
    if (course.teacherId !== userId) throw new ForbiddenException('Sem permissão');
    return this.prisma.module.create({ data: { ...dto, courseId } });
  }

  async createLesson(moduleId: string, dto: CreateLessonDto, userId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    if (module.course.teacherId !== userId) throw new ForbiddenException('Sem permissão');
    return this.prisma.lesson.create({ data: { ...dto, moduleId } });
  }

  async enroll(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso não encontrado');
    return this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId },
      update: { status: 'ACTIVE' },
    });
  }

  async myEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { course: { include: { teacher: { select: { id: true, name: true } } } } },
    });
  }
}
