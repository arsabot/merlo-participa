'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint, ComplaintStatus, RequestType } from '@/lib/types';
import { NEIGHBORHOODS, COMPLAINT_CATEGORIES, COMPLAINT_STATUS_CONFIG, REQUEST_TYPES } from '@/lib/constants';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  RotateCcw, 
  Layers, 
  MapPin, 
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

function ReclamosContent() {
  const searchParams = useSearchParams();
  const initialBarrio = searchParams.get('barrio') || 'all';
  const initialCat = searchParams.get('categoria') || 'all';

  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialBarrio);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent');

  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const list = complaintsService.getComplaints({
      search: search.trim(),
      neighborhoodId: selectedNeighborhood,
      categoryId: selectedCategory,
      status: selectedStatus === 'all' ? undefined : (selectedStatus as ComplaintStatus),
      requestType: selectedType === 'all' ? undefined : (selectedType as RequestType),
      sortBy,
    });
    setComplaints(list);
  }, [search, selectedNeighborhood, selectedCategory, selectedStatus, selectedType, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedNeighborhood('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSortBy('recent');
  };

  const hasActiveFilters =
    search ||
    selectedNeighborhood !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedType !== 'all' ||
    sortBy !== 'recent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4EF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#391759]">
            Participación Ciudadana
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#17151D] tracking-tight mt-1">
            Reclamos y Reportes Vecinales
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6875] mt-1">
            Explorá los reportes comunitarios presentados en los diferentes barrios de Merlo.
          </p>
        </div>

        <Link
          href="/reclamos/nuevo"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#391759] hover:bg-[#240c3a] shadow-md shadow-[#391759]/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Presentar nuevo reporte</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E4EF] shadow-lla-soft space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por palabra clave, dirección, código de seguimiento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#622899] focus:border-[#391759] bg-slate-50/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Dropdown filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Neighborhood filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Barrio de Merlo
            </label>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Todos los barrios</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Todas las categorías</option>
              {COMPLAINT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Estado de gestión
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(COMPLAINT_STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="recent">Más recientes</option>
              <option value="popular">Más apoyados por vecinos</option>
              <option value="oldest">Más antiguos</option>
            </select>
          </div>

        </div>

        {/* Filter tags & active reset */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Filtros activos &bull; <strong>{complaints.length}</strong> resultados encontrados
            </span>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-bold text-[#391759] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer filtros</span>
            </button>
          </div>
        )}

      </div>

      {/* Complaints Grid */}
      {complaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E4EF] shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#391759] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No se encontraron reclamos
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No hay reportes que coincidan con los filtros seleccionados. Probá modificando los criterios o cargá tu reporte.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#240c3a] bg-[#F4ECF9] border border-purple-200"
            >
              Ver todos los reclamos
            </button>
            <Link
              href="/reclamos/nuevo"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#391759]"
            >
              Presentar un reclamo
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ReclamosPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        Cargando listado de reclamos de Merlo...
      </div>
    }>
      <ReclamosContent />
    </Suspense>
  );
}
