import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter, X } from 'lucide-react';

const BRANDS = ['ASUS', 'Dell', 'HP', 'Lenovo', 'Apple', 'MSI'];
const RAM_OPTIONS = [4, 8, 16, 32, 64];
const STORAGE_OPTIONS = [256, 512, 1024, 2048];
const CPU_MANUFACTURERS = ['Intel', 'AMD', 'Apple'];

function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
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

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter size={18} />
          فیلترها
        </h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X size={14} />
            پاک کردن
          </button>
        )}
      </div>

      {/* Brand */}
      <FilterSection title="برند">
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive('brand', brand)}
                onChange={() => updateFilter('brand', brand)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="قیمت">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="از"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="تا"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            اعمال
          </button>
        </div>
      </FilterSection>

      {/* RAM */}
      <FilterSection title="حافظه RAM">
        <div className="flex flex-wrap gap-2">
          {RAM_OPTIONS.map((ram) => (
            <button
              key={ram}
              onClick={() => updateFilter('ram', String(ram))}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                isActive('ram', String(ram))
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-700 hover:border-gray-900'
              }`}
            >
              {ram}GB
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Storage */}
      <FilterSection title="حافظه داخلی">
        <div className="flex flex-wrap gap-2">
          {STORAGE_OPTIONS.map((storage) => (
            <button
              key={storage}
              onClick={() => updateFilter('storage', String(storage))}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                isActive('storage', String(storage))
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-700 hover:border-gray-900'
              }`}
            >
              {storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* CPU */}
      <FilterSection title="پردازنده">
        <div className="space-y-2">
          {CPU_MANUFACTURERS.map((cpu) => (
            <label key={cpu} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive('cpu_manufacturer', cpu)}
                onChange={() => updateFilter('cpu_manufacturer', cpu)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">{cpu}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Touch Screen */}
      <FilterSection title="صفحه نمایش">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive('touch_screen', 'true')}
            onChange={() => updateFilter('touch_screen', 'true')}
            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700">لمسی</span>
        </label>
      </FilterSection>
    </div>
  );
}