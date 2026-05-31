import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { LogOut, BookOpen, Users, Layers } from 'lucide-react';
import type { RootState } from '../store';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('courses');

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Desconectado com sucesso!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Macaw Admin</h1>
            <p className="text-gray-600">Bem-vindo, {admin?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Cursos</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <BookOpen className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Alunos</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Users className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Aulas</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Layers className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'courses'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cursos
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'students'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Alunos
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'lessons'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Aulas
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gerenciar Cursos</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4">
                  + Novo Curso
                </button>
                <p className="text-gray-600">Nenhum curso cadastrado ainda.</p>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gerenciar Alunos</h2>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4">
                  + Novo Aluno
                </button>
                <p className="text-gray-600">Nenhum aluno cadastrado ainda.</p>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gerenciar Aulas</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-4">
                  + Nova Aula
                </button>
                <p className="text-gray-600">Nenhuma aula cadastrada ainda.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
