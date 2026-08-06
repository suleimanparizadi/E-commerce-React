import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, X, Filter, SlidersHorizontal, DollarSign, Cpu, HardDrive, Monitor, Check } from 'lucide-react';

const BRANDS = ['ASUS', 'Dell', 'HP', 'Lenovo', 'Apple', 'MSI'];
const RAM_OPTIONS = [4, 8, 16, 32, 64];
const STORAGE_OPTIONS = [256, 512, 1024, 2048];
const CPU_MANUFACTURERS = ['Intel', 'AMD', 'Apple'];

function FilterSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-blue-100 last:border-0 py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-bold text-[#131212] hover:text-blue-600 transition-colors group"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-blue-500 group-hover:text-blue-600 transition-colors" />}
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`transition-all duration-300 text-gray-400 group-hover:text-blue-500 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="pb-3">{children}</div>}
    </div>
  );
}

export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('min_price') || '',
    max: searchParams.get('max_price') || '',
  });

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const isActive = (key, value) => searchParams.get(key) === value;

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (priceRange.min) params.set('min_price', priceRange.min);
    else params.delete('min_price');
    if (priceRange.max) params.set('max_price', priceRange.max);
    else params.delete('max_price');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange({ min: '', max: '' });
  };

  const hasFilters = searchParams.toString().length > 0;
  const filterCount = searchParams.toString().split('&').filter(p => p).length;

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <Filter size={16} className="text-white" />
          </div>
          <h3 className="text-base font-bold text-[#131212]">فیلترها</h3>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-700 transition-all duration-300 flex items-center gap-1 font-medium hover:gap-2 group"
          >
            <X size={14} className="group-hover:rotate-90 transition-transform" />
            <span>پاک کردن ({filterCount})</span>
          </button>
        )}
      </div>

      {/* Active filters summary */}
      {hasFilters && (
        <div className="mb-4 flex flex-wrap gap-1.5 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <span className="text-xs text-gray-400 ml-1">فیلترهای فعال:</span>
          {Array.from(searchParams.entries()).map(([key, value]) => {
            let displayValue = value;
            if (key === 'ram') displayValue = `${value}GB`;
            else if (key === 'storage') displayValue = Number(value) >= 1024 ? `${Number(value) / 1024}TB` : `${value}GB`;
            else if (key === 'touch_screen') displayValue = 'لمسی';
            else if (key === 'min_price') displayValue = `از ${value}`;
            else if (key === 'max_price') displayValue = `تا ${value}`;
            return (
              <span key={key} className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                {displayValue}
              </span>
            );
          })}
        </div>
      )}

      {/* Brand */}
      <FilterSection title="برند" icon={SlidersHorizontal}>
        <div className="space-y-2.5">
          {BRANDS.map((brand) => {
            const active = isActive('brand', brand);
            return (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => updateFilter('brand', brand)}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                    ${active 
                      ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-200' 
                      : 'border-blue-200 group-hover:border-blue-400 bg-white'
                    }
                  `}>
                    {active && <Check size={12} className="text-white" />}
                  </div>
                </div>
                <span className={`text-sm transition-colors duration-300 ${active ? 'text-blue-600 font-bold' : 'text-gray-500 group-hover:text-[#131212]'}`}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="قیمت" icon={DollarSign}>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">از</span>
              <input
                type="number"
                placeholder="۰"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full px-4 pr-8 py-2.5 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
              />
            </div>
            <div className="relative flex-1">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">تا</span>
              <input
                type="number"
                placeholder="۰"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full px-4 pr-8 py-2.5 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full bg-[#131212] text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-medium text-sm flex items-center justify-center gap-2 group"
          >
            <DollarSign size={14} className="group-hover:scale-110 transition-transform" />
            اعمال قیمت
          </button>
        </div>
      </FilterSection>

      {/* RAM */}
      <FilterSection title="حافظه RAM" icon={Cpu}>
        <div className="flex flex-wrap gap-2">
          {RAM_OPTIONS.map((ram) => {
            const active = isActive('ram', String(ram));
            return (
              <button
                key={ram}
                onClick={() => updateFilter('ram', String(ram))}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                    : 'bg-blue-50/50 text-gray-500 border border-blue-100 hover:bg-blue-100 hover:text-[#131212] hover:scale-105'
                  }
                `}
              >
                {ram}GB
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Storage */}
      <FilterSection title="حافظه داخلی" icon={HardDrive}>
        <div className="flex flex-wrap gap-2">
          {STORAGE_OPTIONS.map((storage) => {
            const active = isActive('storage', String(storage));
            const label = storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`;
            return (
              <button
                key={storage}
                onClick={() => updateFilter('storage', String(storage))}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                    : 'bg-blue-50/50 text-gray-500 border border-blue-100 hover:bg-blue-100 hover:text-[#131212] hover:scale-105'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* CPU */}
      <FilterSection title="پردازنده" icon={Cpu}>
        <div className="space-y-2.5">
          {CPU_MANUFACTURERS.map((cpu) => {
            const active = isActive('cpu_manufacturer', cpu);
            return (
              <label key={cpu} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => updateFilter('cpu_manufacturer', cpu)}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                    ${active 
                      ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-200' 
                      : 'border-blue-200 group-hover:border-blue-400 bg-white'
                    }
                  `}>
                    {active && <Check size={12} className="text-white" />}
                  </div>
                </div>
                <span className={`text-sm transition-colors duration-300 ${active ? 'text-blue-600 font-bold' : 'text-gray-500 group-hover:text-[#131212]'}`}>
                  {cpu}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Touch Screen */}
      <FilterSection title="صفحه نمایش" icon={Monitor}>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isActive('touch_screen', 'true')}
              onChange={() => updateFilter('touch_screen', 'true')}
              className="sr-only"
            />
            <div className={`
              w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300
              ${isActive('touch_screen', 'true')
                ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-200' 
                : 'border-blue-200 group-hover:border-blue-400 bg-white'
              }
            `}>
              {isActive('touch_screen', 'true') && <Check size={12} className="text-white" />}
            </div>
          </div>
          <span className={`text-sm transition-colors duration-300 ${isActive('touch_screen', 'true') ? 'text-blue-600 font-bold' : 'text-gray-500 group-hover:text-[#131212]'}`}>
            لمسی
          </span>
        </label>
      </FilterSection>

      {/* Clear filters button at bottom */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full mt-4 pt-4 border-t border-blue-100 text-sm text-red-500 hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <X size={14} className="group-hover:rotate-90 transition-transform" />
          <span className="font-medium">حذف همه فیلترها</span>
        </button>
      )}
    </div>
  );
}