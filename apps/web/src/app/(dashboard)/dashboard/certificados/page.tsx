'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Certificate {
  id: string;
  code: string;
  issuedAt: string;
  course: { title: string; teacher: { name: string } };
}

export default function CertificadosPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my')
      .then((r) => setCerts(r.data))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Certificados</h1>
        <p className="text-gray-500 text-sm mt-1">Seus certificados de conclusão</p>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Nenhum certificado ainda</p>
          <p className="text-gray-400 text-xs mt-1">Conclua um curso para ganhar seu certificado</p>
          <a href="/dashboard/cursos" className="mt-3 text-sm text-blue-600 hover:underline font-medium inline-block">
            Explorar cursos
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                      {cert.course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Prof. {cert.course.teacher.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Emitido em {new Date(cert.issuedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Código de validação</p>
                    <p className="text-xs font-mono text-gray-600 mt-0.5 truncate max-w-[160px]">
                      {cert.code}
                    </p>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline font-medium">
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
