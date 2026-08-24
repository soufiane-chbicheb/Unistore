import React, { useState } from 'react';
import { Grid, List, Edit2, Trash2, Eye, Plus, Check, ChevronDown, Search } from 'lucide-react';

import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useTheme } from '@/contextHooks/useTheme';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import SelectByRadix from '@/components/ui/SelectByRadix';
import { SectionHeader } from '@/admin/components/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ColorType = {
  id: number;
  name: string;
  code: string;
  types: string[];
  count: number;
  status: string;
  texture: string;
  image: string;
}

const placeholderColors: ColorType[] = [
  { id: 1, name: 'Navy Blue', code: '#001F3F', types: ['Shirts', 'Jackets'], count: 12, status: 'active', texture: '', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Dusty Pink', code: '#D7A9A3', types: ['Hoodies'], count: 4, status: 'inactive', texture: '', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Forest Green', code: '#228B22', types: ['Pants', 'Jackets'], count: 8, status: 'active', texture: '', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Sunset Orange', code: '#FF6347', types: ['Shirts'], count: 6, status: 'active', texture: '', image: 'https://via.placeholder.com/50' },
];


const productTypes = ['all' , 'pants' , 'shirts' , 'shoes' , 'anyting']

export default function ManageColors() {
  const { theme: currentTheme } = useTheme();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [colors, setColors] = useState<ColorType[]>(placeholderColors);
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductType ,  setSelectedProductType] = useState('all')
  return (
    <div className="min-h-screen p-8" style={{ background: currentTheme.bg, color: currentTheme.text }}>
      <div className="max-w-7xl mx-auto" style={{ background: 'transparent' }}>
        {/* Header */}
        <SectionHeader  title='Colors Section'  description='Manage colors here ' >

          <Button 
            variant='outline'
            onClick={() => { setSelectedColor(null); setIsModalOpen(true); }}
            style={{ borderColor: currentTheme.border, color: currentTheme.text }}
          >
            <Plus size={20} />
            Add Color
          </Button>
        </SectionHeader>

        {/* Filters and View Toggle */}
  <div className="rounded-xl shadow-sm p-4 mb-6" style={{ background: currentTheme.bgSecondary, borderColor: currentTheme.border }}>
          <div className="flex flex-wrap gap-4 items-center">
            <SelectByRadix {...({ setter: setSelectedProductType, value: selectedProductType, elements: productTypes } as any)} />
            
          
            <Input
             type="text" 
              placeholder="Search colors..." 
              className="rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64"
            >
             <Search size={18} />
            </Input>
            <div className="ml-auto flex gap-2 p-1 rounded-lg">
              <button 
                onClick={() => setView('grid')} 
                className={`p-2 rounded-md transition-all duration-200 ${view === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                style={view === 'grid' ? { background: 'transparent' } : undefined}
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setView('table')} 
                className={`p-2 rounded-md transition-all duration-200 ${view === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {view === 'grid' ? (
          <ColorGrid 
            colors={colors} 
            onEdit={(c: ColorType) => { setSelectedColor(c); setIsModalOpen(true); }} 
            onDelete={(c: ColorType) => { setSelectedColor(c); setIsDeleteModalOpen(true); }} 
          />
        ) : (
          <ColorTable 
            colors={colors} 
            onEdit={(c: ColorType) => { setSelectedColor(c); setIsModalOpen(true); }} 
            onDelete={(c: ColorType) => { setSelectedColor(c); setIsDeleteModalOpen(true); }} 
          />
        )}

        {/* Modals */}
        {isModalOpen && (
          <ColorModal 
            color={selectedColor} 
            onClose={() => { setSelectedColor(null); setIsModalOpen(false); }} 
            onSave={(colorData: any) => {
              // Handle save logic here
              console.log('Saving color:', colorData);
              setIsModalOpen(false);
              setSelectedColor(null);
            }}
          />
        )}
        
        {isDeleteModalOpen && selectedColor && (
          <DeleteConfirmationModal
            name={selectedColor.name}
            isOpen={isDeleteModalOpen}
            onConfirm={() => {
              setColors(colors.filter(c => c.id !== selectedColor.id));
              setIsDeleteModalOpen(false);
              setSelectedColor(null);
            }}
            onClose={() => { 
              setIsDeleteModalOpen(false); 
              setSelectedColor(null); 
            }}
          />
        )}
      </div>
    </div>
  );
}

ManageColors.layout = (page:any) => <AdminLayout children={page} />

function ColorGrid(props: Readonly<{ colors: ColorType[]; onEdit: (c: ColorType) => void; onDelete: (c: ColorType) => void }>) {
  const { colors, onEdit, onDelete } = props;
  const { theme: currentTheme } = useTheme();

  const handleViewProducts = (color: ColorType) => {
    alert(`Show products using ${color.name}`);
  };

  return (
    <div style={{ paddingInline: '20px', background: currentTheme.bg }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: currentTheme.text }}>Color Grid</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {colors.map((c) => (
            <div key={c.id} className="rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1" style={{ padding: '12px', background: currentTheme.card, borderColor: currentTheme.border }}>
              <div className="flex gap-3 items-center mb-4">
                <div className="rounded-xl shadow-inner shrink-0" style={{ width: 'clamp(3rem, 10vw, 4rem)', height: 'clamp(3rem, 10vw, 4rem)', padding: '0.5rem', backgroundColor: c.code }} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate" style={{ color: currentTheme.text }}>{c.name}</h3>
                  <p className="text-sm font-mono" style={{ color: currentTheme.textSecondary }}>{c.code}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {c.types.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: currentTheme.bgSecondary, color: currentTheme.text, borderColor: currentTheme.border }}>{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                <span className="text-sm" style={{ color: currentTheme.textSecondary }}>
                  <span className="font-semibold" style={{ color: currentTheme.text }}>{c.count}</span> products
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium inline-block" style={c.status === 'active' ? { background: currentTheme.success, color: currentTheme.textInverse, borderColor: currentTheme.border } : { background: currentTheme.error, color: currentTheme.textInverse, borderColor: currentTheme.border }}>{c.status}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200" onClick={() => onEdit(c)} style={{ background: currentTheme.secondary, color: currentTheme.textInverse, borderColor: currentTheme.border }}>
                  <Edit2 size={14} />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200" onClick={() => onDelete(c)} style={{ background: currentTheme.error, color: currentTheme.textInverse, borderColor: currentTheme.border }}>
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
              <button className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200" onClick={() => handleViewProducts(c)} style={{ color: currentTheme.textSecondary }}>
                <Eye size={14} />
                View Products
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorTable(props: Readonly<{ colors: ColorType[]; onEdit: (c: ColorType) => void; onDelete: (c: ColorType) => void }>) {
  const { colors, onEdit, onDelete } = props;
  const { theme: currentTheme } = useTheme();

  return (
    <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: currentTheme.card, border: `1px solid ${currentTheme.border}` }}>
      <table className="w-full">
        <thead style={{ background: currentTheme.bgSecondary, borderBottom: `1px solid ${currentTheme.border}` }}>
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>Preview</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>Code</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>Types</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>Products</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>Actions</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>View Products</th>
          </tr>
        </thead>
        <tbody>
          {colors.map(c => (
            <tr key={c.id} style={{ borderBottom: `1px solid ${currentTheme.border}` }} className="transition-colors duration-150 hover:opacity-95">
              <td className="px-6 py-4">
                <div 
                  className="w-10 h-10 rounded-lg shadow-sm flex-shrink-0" 
                  style={{ 
                    backgroundColor: c.code,
                    backgroundImage: c.texture ? `url(${c.texture})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: `2px solid ${currentTheme.border}`
                  }} 
                />
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium" style={{ color: currentTheme.text }}>{c.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-mono" style={{ color: currentTheme.textSecondary }}>{c.code}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 flex-wrap">
                  {c.types.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: currentTheme.bgSecondary, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium" style={{ color: currentTheme.text }}>{c.count}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block`} style={c.status === 'active' ? { background: currentTheme.success, color: currentTheme.textInverse, border: `1px solid ${currentTheme.border}` } : { background: currentTheme.error, color: currentTheme.textInverse, border: `1px solid ${currentTheme.border}` }}>
                  {c.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                    onClick={() => onEdit(c)}
                    style={{ background: currentTheme.bgSecondary, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                    onClick={() => onDelete(c)}
                    style={{ background: currentTheme.bgSecondary, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                  onClick={() => alert(`Show products using ${c.name}`)}
                  style={{ color: currentTheme.textSecondary }}
                >
                  <Eye size={14} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ColorModal(props: Readonly<{ color?: ColorType | null; onClose: () => void; onSave: (data: { name: string; code: string; altNames: string; types: string[] }) => void }>) {
  const { color, onClose, onSave } = props;
  const [colorValue, setColorValue] = useState<string>(color?.code || '#3B82F6');
  const [colorName, setColorName] = useState<string>(color?.name || '');
  const [altNames, setAltNames] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(color?.types || []);

  const productTypes = ['Shirts', 'Pants', 'Jackets', 'Hoodies', 'Shoes'];

  const toggleType = (type: string) => {
    setSelectedTypes((prev: string[]) => 
      prev.includes(type) 
        ? prev.filter((t: string) => t !== type)
        : [...prev, type]
    );
  };

  const handleSave = () => {
    onSave({
      name: colorName,
      code: colorValue,
      altNames,
      types: selectedTypes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">
            {color ? 'Edit Color' : 'Add New Color'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {color ? 'Update color details' : 'Create a new color for your palette'}
          </p>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Color Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Preview
            </label>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <input 
                  type="color" 
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  className="w-24 h-24 rounded-xl border-4 border-gray-200 cursor-pointer shadow-inner"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  placeholder="#HEX Code" 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Color Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Name
            </label>
            <input 
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="e.g., Navy Blue" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Alternative Names */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alternative Names <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="text"
              value={altNames}
              onChange={(e) => setAltNames(e.target.value)}
              placeholder="e.g., Dark Blue, Midnight Blue" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Product Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Types
            </label>
            <div className="flex flex-wrap gap-2">
              {productTypes.map(type => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button 
                    key={type}
                    onClick={() => toggleType(type)}
                    type="button"
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button 
            onClick={onClose}
            type="button"
            className="flex-1 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            type="button"
            className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
          >
            {color ? 'Update Color' : 'Add Color'}
          </button>
        </div>
      </div>
    </div>
  );
}

