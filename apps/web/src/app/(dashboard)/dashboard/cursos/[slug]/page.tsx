'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Lesson {
  id: string;
  title: string;
  duration?: number;
  contentType: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  teacher: { id: string; name: string; avatar?: string };
  category?: { name: string };
  modules: Module[];
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    api.get(`/courses/${slug}`)
      .then((r) => setCourse(r.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleEnroll() {
    if (!course) return;
    setEnrolling(true);
    try {
      await api.post(`/courses/${course.id}/enroll`);
      setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  }

  const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;
  const totalMinutes = course?.modules.reduce((acc, m) =>
    acc + m.lessons.reduce((a, l) => a + (l.duration ?? 0), 0), 0) ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Curso não encontrado.</p>
        <a href="/dashboard/cursos" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          Voltar para cursos
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <a href="/dashboard/cursos" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← Voltar para cursos
      </a>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {course.category && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {course.category.name}
                </span>
              )}
              <h1 className="text-xl font-bold text-gray-900 mt-2">{course.title}</h1>
              {course.description && (
                <p className="text-gray-500 text-sm mt-2">{course.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span>{course.modules.length} módulos</span>
                <span>{totalLessons} aulas</span>
                {totalMinutes > 0 && <span>{Math.round(totalMinutes / 60)}h de conteúdo</span>}
                <span>Prof. {course.teacher.name}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-gray-900">
                {course.price === 0 ? 'Grátis' : `R$ ${course.price.toFixed(2)}`}
              </p>
              <button
                onClick={handleEnroll}
                disabled={enrolling || enrolled}
                className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {enrolled ? '✓ Matriculado' : enrolling ? 'Matriculando...' : 'Matricular-se'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Conteúdo do curso</h2>
        {course.modules.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">Nenhum módulo disponível ainda.</p>
          </div>
        ) : (
          course.modules.map((mod) => (
            <div key={mod.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">{mod.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{mod.lessons.length} aulas</p>
              </div>
              <ul className="divide-y divide-gray-100">
                {mod.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
                    {lesson.duration && (
                      <span className="text-xs text-gray-400">{lesson.duration}min</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
