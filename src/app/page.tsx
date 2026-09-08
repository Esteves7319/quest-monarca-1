'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 inline-block">
            <div className="w-12 h-12 rounded-full border-4 border-neon-cyan border-t-neon-pink animate-spin" />
          </div>
          <p className="text-neon-cyan font-rajdhani text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-neon-cyan/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">⚔️</span>
            </div>
            <h1 className="text-2xl font-orbitron font-bold text-neon-cyan">
              Quest Monarca
            </h1>
          </div>

          {isAuthenticated ? (
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-neon-cyan text-slate-900 rounded-lg font-rajdhani font-bold hover:bg-neon-pink transition-colors"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="px-6 py-2 border-2 border-neon-cyan text-neon-cyan rounded-lg font-rajdhani font-bold hover:bg-neon-cyan/10 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-neon-pink text-slate-900 rounded-lg font-rajdhani font-bold hover:bg-neon-cyan transition-colors"
              >
                Registar
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-5xl font-orbitron font-bold mb-6">
              <span className="text-neon-cyan">Gamifique</span> Seu
              <br />
              <span className="text-neon-pink">Desenvolvimento</span>
            </h2>

            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Quest Monarca é uma aplicação de desenvolvimento pessoal gamificada.
              Complete quests, ganhe experiência, evolua seu rank e transforme sua vida
              em uma verdadeira jornada épica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/signup"
                    className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-pink text-slate-900 rounded-lg font-rajdhani font-bold text-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
                  >
                    Começar Agora
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-8 py-4 border-2 border-neon-cyan text-neon-cyan rounded-lg font-rajdhani font-bold text-lg hover:bg-neon-cyan/10 transition-all"
                  >
                    Já tenho conta
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-pink text-slate-900 rounded-lg font-rajdhani font-bold text-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
                >
                  Ir para Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-neon-cyan/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-6">
                {/* Stats Preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-neon-cyan/20 rounded-lg p-4">
                    <p className="text-neon-cyan text-sm font-rajdhani">Rank</p>
                    <p className="text-2xl font-bold text-neon-pink">S</p>
                  </div>
                  <div className="bg-slate-900/50 border border-neon-pink/20 rounded-lg p-4">
                    <p className="text-neon-pink text-sm font-rajdhani">Level</p>
                    <p className="text-2xl font-bold text-neon-cyan">50</p>
                  </div>
                  <div className="bg-slate-900/50 border border-neon-cyan/20 rounded-lg p-4">
                    <p className="text-neon-cyan text-sm font-rajdhani">XP</p>
                    <p className="text-2xl font-bold text-neon-pink">50,000</p>
                  </div>
                  <div className="bg-slate-900/50 border border-neon-pink/20 rounded-lg p-4">
                    <p className="text-neon-pink text-sm font-rajdhani">Badges</p>
                    <p className="text-2xl font-bold text-neon-cyan">12</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neon-cyan text-sm font-rajdhani">XP até próximo level</span>
                    <span className="text-neon-pink text-sm">75%</span>
                  </div>
                  <div className="w-full bg-slate-900/80 rounded-full h-2 border border-neon-cyan/20">
                    <div
                      className="bg-gradient-to-r from-neon-cyan to-neon-pink h-full rounded-full"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-orbitron font-bold text-center mb-12">
          Recursos Principais
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎯',
              title: 'Quests Personalizadas',
              desc: 'Crie quests com diferentes dificuldades e atributos.',
            },
            {
              icon: '📊',
              title: 'Atributos',
              desc: 'Desenvolva 6 atributos: Físico, Intelectual, Financeiro, Vitalidade, Carreira e Disciplina.',
            },
            {
              icon: '🏆',
              title: 'Sistema de Ranking',
              desc: 'Suba de E até S rank conforme progride suas quests.',
            },
            {
              icon: '⚡',
              title: 'Offline First',
              desc: 'Funciona completamente offline com sincronização automática.',
            },
            {
              icon: '📱',
              title: 'PWA',
              desc: 'Instale como app nativo no seu telefone ou desktop.',
            },
            {
              icon: '🎖️',
              title: 'Badges & Rewards',
              desc: 'Desbloqueie badges exclusivos ao atingir marcos.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-neon-cyan/20 rounded-xl p-6 hover:border-neon-pink/50 transition-all hover:shadow-lg hover:shadow-neon-cyan/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-neon-cyan font-rajdhani font-bold text-lg mb-2">
                {feature.title}
              </h4>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-cyan/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>© 2026 Quest Monarca. Desenvolvido com ⚔️ por Esteves7319</p>
        </div>
      </footer>
    </div>
  );
}
