import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';

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
        className="w-full flex items-center justify-between py-4 text-base text-amado-dark uppercase"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
    <div className="bg-amado-bg p-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base uppercase text-amado-dark font-normal">فیلترها</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-amado-primary hover:text-amado-dark transition-colors flex items-center gap-1"
          >
            <X size={14} />
            پاک کردن
          </button>
        )}
      </div>

      {/* Brand */}
      <FilterSection title="برند">
        <div className="space-y-3">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isActive('brand', brand)}
                onChange={() => updateFilter('brand', brand)}
                className="rounded-none border-gray-300 text-amado-primary focus:ring-amado-primary w-4 h-4"
              />
              <span className="text-base text-gray-500 group-hover:text-amado-primary transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="قیمت">
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="از"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="w-full px-4 py-3 bg-white border-none text-sm text-gray-600 focus:outline-none"
            />
            <input
              type="number"
              placeholder="تا"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="w-full px-4 py-3 bg-white border-none text-sm text-gray-600 focus:outline-none"
            />
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full amado-btn text-base"
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
              className={`px-4 py-2 text-sm transition-all duration-500 ${
                isActive('ram', String(ram))
                  ? 'bg-amado-primary text-white'
                  : 'bg-white text-gray-500 hover:text-amado-primary'
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
              className={`px-4 py-2 text-sm transition-all duration-500 ${
                isActive('storage', String(storage))
                  ? 'bg-amado-primary text-white'
                  : 'bg-white text-gray-500 hover:text-amado-primary'
              }`}
            >
              {storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* CPU */}
      <FilterSection title="پردازنده">
        <div className="space-y-3">
          {CPU_MANUFACTURERS.map((cpu) => (
            <label key={cpu} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isActive('cpu_manufacturer', cpu)}
                onChange={() => updateFilter('cpu_manufacturer', cpu)}
                className="rounded-none border-gray-300 text-amado-primary focus:ring-amado-primary w-4 h-4"
              />
              <span className="text-base text-gray-500 group-hover:text-amado-primary transition-colors">
                {cpu}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Touch Screen */}
      <FilterSection title="صفحه نمایش">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isActive('touch_screen', 'true')}
            onChange={() => updateFilter('touch_screen', 'true')}
            className="rounded-none border-gray-300 text-amado-primary focus:ring-amado-primary w-4 h-4"
          />
          <span className="text-base text-gray-500 group-hover:text-amado-primary transition-colors">
            لمسی
          </span>
        </label>
      </FilterSection>
    </div>
  );
}