import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, Users, Plane } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <header className="absolute top-0 right-0 p-6 z-10">
        <Link href="/login">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
            Iniciar Sesión
          </Button>
        </Link>
      </header>

      <main className="relative">
        <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium backdrop-blur-sm border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Asistente inteligente, diseño 100% humano</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Tu próximo viaje,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                diseñado a medida por expertos
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Cuéntale tus planes a nuestro chat inteligente para empezar. A partir de ahí, un especialista en viajes diseña y verifica cada detalle de tu itinerario a mano para ofrecerte una experiencia única.
            </p>

            <div className="pt-4">
              <Link href="/chat">
                <Button size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                  Iniciar Chat de Viajes
                  <MessageCircle className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
              ¿Cómo funciona?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  1. Cuéntanos qué buscas
                </h3>
                <p className="text-slate-400">
                  Chatea con nuestro asistente inteligente para contarnos tu destino ideal, fechas y presupuesto.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  2. Diseño artesanal y humano
                </h3>
                <p className="text-slate-400">
                  Un experto humano revisa tus gustos y diseña tu itinerario a mano, cuidando cada detalle.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Plane className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  3. Disfruta tu viaje
                </h3>
                <p className="text-slate-400">
                  Recibe tu propuesta detallada y prepárate para vivir una experiencia inolvidable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Comienza a planificar tu próxima aventura
            </h2>
            <p className="text-xl text-slate-300">
              Sin registros complicados. Sin esperas. Solo tu viaje perfecto.
            </p>
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                Empezar ahora
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 WebTravel. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
