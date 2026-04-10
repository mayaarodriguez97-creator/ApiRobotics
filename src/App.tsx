import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Database, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  Search,
  Battery,
  Thermometer,
  Droplets,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Types ---
interface Hive {
  id: string;
  farmId: string;
  battery: number;
  temp: number;
  humidity: number;
  status: 'active' | 'warning' | 'offline';
  lastConnection: string;
}

interface Farm {
  id: string;
  name: string;
  location: string;
  contractStatus: string;
  totalHives: number;
}

interface Alert {
  id: number;
  type: string;
  message: string;
  timestamp: string;
}

// --- Mock Data for Charts ---
const efficiencyData = [
  { name: 'Lun', value: 82 },
  { name: 'Mar', value: 85 },
  { name: 'Mie', value: 88 },
  { name: 'Jue', value: 84 },
  { name: 'Vie', value: 91 },
  { name: 'Sab', value: 94 },
  { name: 'Dom', value: 92 },
];

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hives, setHives] = useState<Hive[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch data from our Express API
    const fetchData = async () => {
      try {
        const [hivesRes, farmsRes, alertsRes] = await Promise.all([
          fetch('/api/hives'),
          fetch('/api/farms'),
          fetch('/api/alerts')
        ]);
        
        setHives(await hivesRes.json());
        setFarms(await farmsRes.json());
        setAlerts(await alertsRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!showDashboard) {
    return <LandingPage onEnter={() => setShowDashboard(true)} />;
  }

  return (
    <div className="flex h-screen bg-api-deep overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0, width: isSidebarOpen ? 280 : 80 }}
        className="bg-api-dark border-r border-api-surface flex flex-col z-50"
      >
        <div className="p-6 flex items-center gap-3">
          <a 
            href="https://stitch.withgoogle.com/preview/3359993355670940232?node-id=7f1a8798b2c84dc2998e769cbd23bcbf"
            target="_blank"
            rel="noopener noreferrer"
            title="Ir al Portal del Agricultor (Stitch)"
            className="w-10 h-10 bg-api-lime rounded-lg flex items-center justify-center shrink-0 hover:scale-110 transition-transform cursor-pointer shadow-[0_0_15px_rgba(145,216,87,0.4)] relative group/logo"
          >
            <div className="w-6 h-6 bg-api-deep hexagon-mask flex items-center justify-center group-hover/logo:opacity-20 transition-opacity">
              <div className="w-2 h-2 bg-api-lime rounded-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity">
              <Wifi size={16} className="text-api-deep animate-pulse" />
            </div>
          </a>
          {isSidebarOpen && (
            <span className="font-headline font-black text-xl tracking-tighter text-api-white uppercase">
              API ROBOTICS
            </span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<MapIcon size={20} />} 
            label="Mapas de Fundos" 
            active={activeTab === 'maps'} 
            onClick={() => setActiveTab('maps')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Database size={20} />} 
            label="Inventario IoT" 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Operarios" 
            active={activeTab === 'operators'} 
            onClick={() => setActiveTab('operators')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<FileText size={20} />} 
            label="Contratos" 
            active={activeTab === 'contracts'} 
            onClick={() => setActiveTab('contracts')}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-api-surface space-y-2">
          <NavItem 
            icon={<Settings size={20} />} 
            label="Configuración" 
            active={false} 
            onClick={() => {}}
            collapsed={!isSidebarOpen}
          />
          <button 
            onClick={() => setShowDashboard(false)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-api-white/60 hover:bg-api-surface transition-colors"
          >
            <X size={20} />
            {isSidebarOpen && <span>Salir a Portada</span>}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-api-white/60 hover:bg-api-surface transition-colors"
          >
            {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
            {isSidebarOpen && <span>Colapsar Menú</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 border-b border-api-surface bg-api-deep/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-api-dark px-4 py-2 rounded-xl border border-api-surface w-96">
            <Search size={18} className="text-api-white/40" />
            <input 
              type="text" 
              placeholder="Buscar colmena, fundo o alerta..." 
              className="bg-transparent border-none outline-none text-sm w-full text-api-white placeholder:text-api-white/20"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell size={22} className="text-api-white/60 cursor-pointer hover:text-api-lime transition-colors" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                  {alerts.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-api-surface">
              <div className="text-right">
                <p className="text-sm font-bold">Admin Ops</p>
                <p className="text-xs text-api-white/40">Nivel Senior</p>
              </div>
              <div className="w-10 h-10 bg-api-surface rounded-full border border-api-lime/30 overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    title="Colmenas Activas" 
                    value={hives.filter(h => h.status === 'active').length.toString()} 
                    trend="+12%" 
                    icon={<CheckCircle2 className="text-api-lime" />}
                  />
                  <StatCard 
                    title="Alertas Críticas" 
                    value={alerts.filter(a => a.type === 'critical').length.toString()} 
                    trend="-5%" 
                    icon={<AlertTriangle className="text-red-400" />}
                    isNegative
                  />
                  <StatCard 
                    title="Eficiencia Promedio" 
                    value="94.2%" 
                    trend="+2.4%" 
                    icon={<LayoutDashboard className="text-api-lime" />}
                  />
                  <StatCard 
                    title="Fundos Operativos" 
                    value={farms.length.toString()} 
                    trend="Estable" 
                    icon={<MapIcon className="text-api-white/60" />}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Efficiency Chart */}
                  <div className="lg:col-span-2 bg-api-dark p-6 rounded-2xl border border-api-surface">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-bold">Eficiencia de Polinización</h3>
                        <p className="text-sm text-api-white/40">Promedio semanal de actividad IoT</p>
                      </div>
                      <select className="bg-api-surface border border-api-surface rounded-lg px-3 py-1 text-xs outline-none">
                        <option>Últimos 7 días</option>
                        <option>Último mes</option>
                      </select>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={efficiencyData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#91D857" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#91D857" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#0A3A4F" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#FDFDFD40" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#FDFDFD40" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(val) => `${val}%`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#051C26', border: '1px solid #0A3A4F', borderRadius: '12px' }}
                            itemStyle={{ color: '#91D857' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#91D857" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Alerts */}
                  <div className="bg-api-dark p-6 rounded-2xl border border-api-surface">
                    <h3 className="text-lg font-bold mb-6">Alertas Recientes</h3>
                    <div className="space-y-4">
                      {alerts.map(alert => (
                        <div key={alert.id} className="flex gap-4 p-4 rounded-xl bg-api-surface/30 border border-api-surface hover:bg-api-surface/50 transition-colors cursor-pointer">
                          <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${alert.type === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            <AlertTriangle size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-tight">{alert.message}</p>
                            <p className="text-[10px] text-api-white/30 mt-1 uppercase tracking-wider">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-bold text-api-lime hover:bg-api-lime/10 rounded-xl transition-colors">
                      Ver todas las alertas
                    </button>
                  </div>
                </div>

                {/* Hive Inventory Preview */}
                <div className="bg-api-dark rounded-2xl border border-api-surface overflow-hidden">
                  <div className="p-6 border-b border-api-surface flex items-center justify-between">
                    <h3 className="text-lg font-bold">Estado de Flota IoT</h3>
                    <button 
                      onClick={() => setActiveTab('inventory')}
                      className="text-sm text-api-lime flex items-center gap-1 hover:underline"
                    >
                      Ver inventario completo <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-api-surface/30 text-[10px] uppercase tracking-widest text-api-white/40">
                          <th className="px-6 py-4 font-bold">ID Colmena</th>
                          <th className="px-6 py-4 font-bold">Fundo</th>
                          <th className="px-6 py-4 font-bold">Batería</th>
                          <th className="px-6 py-4 font-bold">Sensores</th>
                          <th className="px-6 py-4 font-bold">Estado</th>
                          <th className="px-6 py-4 font-bold">Última Conexión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-api-surface">
                        {hives.map(hive => (
                          <tr key={hive.id} className="hover:bg-api-surface/20 transition-colors">
                            <td className="px-6 py-4 font-mono text-sm">{hive.id}</td>
                            <td className="px-6 py-4 text-sm">{hive.farmId}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Battery size={16} className={hive.battery < 20 ? 'text-red-400' : 'text-api-lime'} />
                                <span className="text-sm">{hive.battery}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4 text-api-white/60">
                                <span className="flex items-center gap-1 text-xs"><Thermometer size={14} /> {hive.temp}°C</span>
                                <span className="flex items-center gap-1 text-xs"><Droplets size={14} /> {hive.humidity}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                hive.status === 'active' ? 'bg-api-lime/20 text-api-lime' :
                                hive.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-api-white/10 text-api-white/40'
                              }`}>
                                {hive.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-api-white/40">
                              {new Date(hive.lastConnection).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-api-dark rounded-2xl border border-api-surface p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Gestión de Inventario IoT</h2>
                  <button className="bg-api-lime text-api-deep px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    + Registrar Nueva Colmena
                  </button>
                </div>
                <p className="text-api-white/60 mb-8">Aquí puedes gestionar todas las colmenas inteligentes desplegadas en los fundos.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-api-surface/30 border border-api-surface rounded-2xl">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-api-white/40">Hardware Saludable</h4>
                    <p className="text-4xl font-bold text-api-lime">92%</p>
                  </div>
                  <div className="p-6 bg-api-surface/30 border border-api-surface rounded-2xl">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-api-white/40">Mantenimiento Pendiente</h4>
                    <p className="text-4xl font-bold text-yellow-400">8</p>
                  </div>
                  <div className="p-6 bg-api-surface/30 border border-api-surface rounded-2xl">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-api-white/40">Último Despliegue</h4>
                    <p className="text-4xl font-bold text-api-white">48h</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'maps' && (
              <motion.div 
                key="maps"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-api-dark rounded-2xl border border-api-surface p-8 h-[600px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Diagnóstico Geoespacial</h2>
                  <div className="flex gap-2">
                    {farms.map(farm => (
                      <button key={farm.id} className="px-4 py-2 rounded-lg bg-api-surface border border-api-surface text-sm hover:border-api-lime transition-colors">
                        {farm.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 bg-api-deep rounded-xl border border-api-surface relative overflow-hidden flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 800 400" className="opacity-40">
                    <path d="M100,100 L200,50 L350,80 L500,40 L700,120 L650,250 L400,300 L150,280 Z" fill="none" stroke="#91D857" strokeWidth="2" strokeDasharray="5,5" />
                    <circle cx="200" cy="150" r="8" fill="#91D857" />
                    <circle cx="300" cy="120" r="8" fill="#91D857" />
                    <circle cx="450" cy="180" r="8" fill="#f87171" />
                    <circle cx="550" cy="140" r="8" fill="#91D857" />
                    <circle cx="380" cy="220" r="8" fill="#fbbf24" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-api-dark/80 backdrop-blur-md p-4 rounded-xl border border-api-lime/30 text-center">
                      <p className="text-api-lime font-bold">Mapa Operativo Detallado</p>
                      <p className="text-xs text-api-white/60">Integrando datos de telemetría en tiempo real</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 bg-api-dark/90 p-4 rounded-xl border border-api-surface space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-api-lime" /> <span>Saludable</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-yellow-400" /> <span>Atención</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-red-400" /> <span>Crítico</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Landing Page Component ---
function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen bg-pattern flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-8 lg:px-24 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-api-lime rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-api-deep hexagon-mask flex items-center justify-center">
              <div className="w-2 h-2 bg-api-lime rounded-full" />
            </div>
          </div>
          <span className="font-headline font-black text-xl tracking-tighter text-api-white uppercase">
            API ROBOTICS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-api-white/60">
          <a href="#" className="text-api-lime border-b-2 border-api-lime pb-1">Inicio</a>
          <a href="#" className="hover:text-api-white transition-colors">Solución</a>
          <a href="#" className="hover:text-api-white transition-colors">Nosotros</a>
          <a href="#" className="hover:text-api-white transition-colors">Contacto</a>
        </div>
        <button 
          onClick={onEnter}
          className="bg-api-lime text-api-deep px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(145,216,87,0.3)]"
        >
          Empezar Ahora
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col lg:flex-row items-center px-8 lg:px-24 py-12 lg:py-0 gap-12 relative">
        <div className="flex-1 space-y-8 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-api-surface/50 border border-api-lime/30 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-api-lime rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-api-lime">Próxima Gen AgTech</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-api-white">
            Asegurando el futuro de la <span className="text-api-lime">agroexportación</span> con tecnología y biodiversidad
          </h1>
          <p className="text-lg text-api-white/60 leading-relaxed">
            Polinización inteligente con IoT para optimizar la productividad de tus cultivos de arándanos y paltos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onEnter}
              className="bg-api-lime text-api-deep px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(145,216,87,0.4)]"
            >
              Empezar Ahora
            </button>
            <button className="bg-api-dark/50 border border-api-surface text-api-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-api-surface transition-colors">
              Ver Solución
            </button>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-full max-w-lg aspect-square">
            {/* Hexagonal Image Container */}
            <div className="absolute inset-0 bg-api-lime/20 hexagon-mask scale-105 blur-2xl animate-pulse" />
            <div className="absolute inset-0 bg-api-dark hexagon-mask border-4 border-api-lime/30 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <img 
                src="https://picsum.photos/seed/apirobotics/800/800" 
                alt="Smart Beehive" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-api-dark/90 backdrop-blur-xl p-6 rounded-2xl border border-api-surface shadow-2xl z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-api-lime/20 rounded-xl flex items-center justify-center text-api-lime">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-api-white/40">Actuadores Colmena</p>
                  <p className="text-2xl font-black text-api-lime">+24% Eficiencia</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 lg:px-24 py-24 bg-api-dark/30 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-api-white">Desafíos vs <span className="text-api-lime">Evolución</span></h2>
          <div className="w-24 h-1 bg-api-lime mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Baja Productividad"
            desc="Pérdidas significativas en la cosecha debido a una polinización ineficiente y no supervisada."
            icon={<AlertTriangle className="text-red-400" />}
          />
          <FeatureCard 
            title="Monitoreo en Tiempo Real"
            desc="Sensores IoT integrados que proporcionan datos precisos sobre el comportamiento de los polinizadores cada segundo."
            icon={<LayoutDashboard className="text-api-lime" />}
            isHighlight
          />
          <FeatureCard 
            title="Falta de Control"
            desc="Imposibilidad de medir el impacto real de las colmenas en el campo sin herramientas digitales."
            icon={<Settings className="text-api-white/40" />}
          />
          <FeatureCard 
            title="Colmenas Inteligentes"
            desc="Nuestra tecnología convierte cada colmena en un nodo de datos estratégicos para su fundo."
            icon={<Database className="text-api-lime" />}
          />
          <FeatureCard 
            title="Costos Crecientes"
            desc="Inversiones ineficientes en insumos que no garantizan un retorno sobre el rendimiento del cultivo."
            icon={<FileText className="text-api-white/40" />}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="p-8 text-center border-t border-api-surface text-api-white/20 text-xs uppercase tracking-widest">
        © 2026 API ROBOTICS - Polinización Inteligente para Agroexportación
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon, isHighlight = false }: { title: string; desc: string; icon: React.ReactNode; isHighlight?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl border transition-all hover:scale-105 ${
      isHighlight 
        ? 'bg-api-surface/40 border-api-lime/30 shadow-[0_0_30px_rgba(145,216,87,0.1)]' 
        : 'bg-api-dark/50 border-api-surface hover:border-api-white/10'
    }`}>
      <div className="w-12 h-12 rounded-2xl bg-api-deep flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-api-white/50 leading-relaxed">{desc}</p>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active, 
  onClick,
  collapsed 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
        active 
          ? 'bg-api-lime text-api-deep font-bold shadow-[0_0_15px_rgba(145,216,87,0.3)]' 
          : 'text-api-white/60 hover:bg-api-surface hover:text-api-white'
      }`}
    >
      <span className={active ? 'text-api-deep' : 'group-hover:text-api-lime transition-colors'}>
        {icon}
      </span>
      {!collapsed && <span className="text-sm tracking-tight">{label}</span>}
    </button>
  );
}

function StatCard({ 
  title, 
  value, 
  trend, 
  icon, 
  isNegative = false 
}: { 
  title: string; 
  value: string; 
  trend: string; 
  icon: React.ReactNode;
  isNegative?: boolean;
}) {
  return (
    <div className="bg-api-dark p-6 rounded-2xl border border-api-surface hover:border-api-lime/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-api-surface flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
          trend === 'Estable' ? 'bg-api-white/10 text-api-white/40' :
          isNegative ? 'bg-red-500/10 text-red-400' : 'bg-api-lime/10 text-api-lime'
        }`}>
          {trend}
        </span>
      </div>
      <h4 className="text-api-white/40 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-3xl font-bold font-headline">{value}</p>
    </div>
  );
}
