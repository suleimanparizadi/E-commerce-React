import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Package,
  Search,
  ChevronLeft,
  Filter,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const INITIAL_FORM = {
  name: '',
  brand: '',
  price: '',
  stock: '',
  ram: '',
  storage: '',
  gpu: '',
  on_board_gpu: false,
  touch_screen: false,
  display_size: '',
  description: '',
  category: '',
  cpu: '',
  is_active: true,
};

export default function AdminProductsPage() {
  const {
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    cpus,
    categories,
  } = useAdmin();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isLoading = products.isLoading;
  const productList = products.data || [];

  const filteredProducts = searchQuery.trim()
    ? productList.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productList;

  // Calculate stats
  const totalProducts = productList.length;
  const activeProducts = productList.filter(p => p.is_active).length;
  const lowStockProducts = productList.filter(p => p.stock < 10).length;

  const openCreate = () => {
    setEditingSlug(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingSlug(product.slug);
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      price: product.price || '',
      stock: product.stock ?? '',
      ram: product.ram || '',
      storage: product.storage || '',
      gpu: product.gpu || '',
      on_board_gpu: product.on_board_gpu || false,
      touch_screen: product.touch_screen || false,
      display_size: product.display_size || '',
      description: product.description || '',
      category: product.category?.slug || '',
      cpu: product.cpu?.id || '',
      is_active: product.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      ram: Number(form.ram),
      storage: Number(form.storage),
      display_size: form.display_size ? Number(form.display_size) : null,
      cpu: form.cpu ? Number(form.cpu) : null,
    };

    if (editingSlug) {
      updateProduct.mutate({ slug: editingSlug, data: payload });
    } else {
      createProduct.mutate(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = (slug) => {
    if (deleteConfirm === slug) {
      deleteProduct.mutate(slug);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(slug);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const cpuList = cpus.data || [];
  const categoryList = categories.data || [];

  // Quick stats cards
  const stats = [
    {
      label: 'کل محصولات',
      value: totalProducts,
      icon: Package,
      bgColor: 'bg-blue-600',
      iconBg: 'bg-blue-500',
      shadow: 'shadow-blue-200',
    },
    {
      label: 'محصولات فعال',
      value: activeProducts,
      icon: TrendingUp,
      bgColor: 'bg-[#fbb710]',
      iconBg: 'bg-[#e5a50f]',
      shadow: 'shadow-yellow-200',
      textColor: 'text-[#131212]',
    },
    {
      label: 'موجودی کم',
      value: lowStockProducts,
      icon: AlertCircle,
      bgColor: 'bg-[#131212]',
      iconBg: 'bg-gray-700',
      shadow: 'shadow-gray-200',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header with gradient underline */}
      <div className="mb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-1 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Package size={22} className="text-white" />
              </span>
              مدیریت محصولات
            </h1>
            <p className="text-blue-500 text-sm mr-13">افزودن، ویرایش و حذف محصولات فروشگاه</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md shadow-blue-200 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            محصول جدید
          </button>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isYellow = stat.bgColor === 'bg-[#fbb710]';
          return (
            <div
              key={stat.label}
              className={`
                ${stat.bgColor} rounded-2xl p-4 shadow-lg ${stat.shadow} 
                hover:shadow-xl hover:-translate-y-1 
                transition-all duration-300 group relative overflow-hidden
                animate-slideDown
                ${index === 0 ? '[animation-delay:0ms]' : ''}
                ${index === 1 ? '[animation-delay:100ms]' : ''}
                ${index === 2 ? '[animation-delay:200ms]' : ''}
              `}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-xl ${stat.iconBg} 
                  flex items-center justify-center shadow-md
                  group-hover:scale-110 group-hover:rotate-6 
                  transition-all duration-300
                `}>
                  <Icon size={18} className={isYellow ? 'text-[#131212]' : 'text-white'} />
                </div>
                <div>
                  <p className={`text-sm ${isYellow ? 'text-[#131212]/70' : 'text-white/70'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-xl font-bold ${isYellow ? 'text-[#131212]' : 'text-white'}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg shadow-blue-50 border border-blue-100 p-4 mb-6 hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:300ms]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="جستجوی محصول بر اساس نام یا برند..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-10 pl-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Filter size={16} />
            <span>{filteredProducts.length} محصول</span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-50 border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:400ms]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package size={20} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-blue-600 font-medium animate-pulse">بارگذاری محصولات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-blue-300" />
            </div>
            <p className="text-gray-400 font-medium">محصولی یافت نشد</p>
            <p className="text-sm text-gray-300 mt-1">
              {searchQuery ? 'با جستجوی دیگری امتحان کنید' : 'برای شروع، محصول جدید اضافه کنید'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-50/30">
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">محصول</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">برند</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">قیمت</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">موجودی</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">دسته‌بندی</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.slug} 
                    className={`
                      hover:bg-blue-50/30 transition-all duration-200 group
                      ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/10'}
                    `}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover bg-blue-50 shadow-sm group-hover:shadow-md transition-shadow"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <Package size={16} className="text-blue-400" />
                          </div>
                        )}
                        <span className="text-sm font-bold text-[#131212] group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{product.brand}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {product.price
                        ? `${new Intl.NumberFormat('fa-IR').format(product.price)} تومان`
                        : '—'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        ${product.stock > 20 ? 'bg-green-100 text-green-700 border border-green-200' : ''}
                        ${product.stock >= 10 && product.stock <= 20 ? 'bg-amber-100 text-amber-700 border border-amber-200' : ''}
                        ${product.stock < 10 && product.stock > 0 ? 'bg-red-100 text-red-700 border border-red-200' : ''}
                        ${product.stock === 0 ? 'bg-gray-100 text-gray-500 border border-gray-200' : ''}
                        transition-all duration-300 hover:scale-105
                      `}>
                        <span className={`
                          w-1.5 h-1.5 rounded-full
                          ${product.stock > 20 ? 'bg-green-500' : ''}
                          ${product.stock >= 10 && product.stock <= 20 ? 'bg-amber-500' : ''}
                          ${product.stock < 10 && product.stock > 0 ? 'bg-red-500 animate-pulse' : ''}
                          ${product.stock === 0 ? 'bg-gray-400' : ''}
                        `}></span>
                        {product.stock?.toLocaleString('fa-IR') || '۰'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex px-2.5 py-1 rounded-full text-xs font-medium 
                        ${product.is_active 
                          ? 'bg-green-100 text-green-700 border border-green-200 hover:shadow-md' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }
                        transition-all duration-300 hover:scale-105
                      `}>
                        {product.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                          title="ویرایش"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          className={`
                            p-2 rounded-lg transition-all duration-300
                            ${deleteConfirm === product.slug 
                              ? 'text-red-600 bg-red-50 scale-110' 
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-110'
                            }
                          `}
                          title={deleteConfirm === product.slug ? 'کلیک کنید برای تأیید حذف' : 'حذف'}
                        >
                          <Trash2 size={16} />
                        </button>
                        {deleteConfirm === product.slug && (
                          <span className="text-xs text-red-500 font-medium animate-pulse mr-1">
                            تأیید?
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-100 animate-slideDown">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                  {editingSlug ? (
                    <Pencil size={16} className="text-white" />
                  ) : (
                    <Plus size={16} className="text-white" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-[#131212]">
                  {editingSlug ? 'ویرایش محصول' : 'محصول جدید'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">نام محصول</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">برند</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">قیمت (تومان)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">موجودی</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* RAM */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">RAM (GB)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.ram}
                    onChange={(e) => setForm({ ...form, ram: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* Storage */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">Storage (GB)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* GPU */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">GPU</label>
                  <input
                    type="text"
                    required
                    value={form.gpu}
                    onChange={(e) => setForm({ ...form, gpu: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* Display Size */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">اندازه نمایشگر (اینچ)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.display_size}
                    onChange={(e) => setForm({ ...form, display_size: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">دسته‌بندی</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  >
                    <option value="">انتخاب کنید</option>
                    {categoryList.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* CPU */}
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1.5">پردازنده</label>
                  <select
                    required
                    value={form.cpu}
                    onChange={(e) => setForm({ ...form, cpu: e.target.value })}
                    className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  >
                    <option value="">انتخاب کنید</option>
                    {cpuList.map((cpu) => (
                      <option key={cpu.id} value={cpu.id}>
                        {cpu.manufacturer} {cpu.series} {cpu.model} ({cpu.cores} هسته)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6 bg-gradient-to-r from-blue-50/50 to-blue-50/30 rounded-xl p-4 border border-blue-100">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.on_board_gpu}
                    onChange={(e) => setForm({ ...form, on_board_gpu: e.target.checked })}
                    className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 transition-all group-hover:scale-110"
                  />
                  <span className="text-sm text-blue-700 group-hover:text-blue-900 transition-colors">GPU آنبرد</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.touch_screen}
                    onChange={(e) => setForm({ ...form, touch_screen: e.target.checked })}
                    className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 transition-all group-hover:scale-110"
                  />
                  <span className="text-sm text-blue-700 group-hover:text-blue-900 transition-colors">صفحه لمسی</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 transition-all group-hover:scale-110"
                  />
                  <span className="text-sm text-blue-700 group-hover:text-blue-900 transition-colors">فعال</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1.5">توضیحات</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:transform-none shadow-md shadow-blue-200 flex items-center gap-2"
                >
                  {createProduct.isPending || updateProduct.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ChevronLeft size={16} />
                  )}
                  {editingSlug ? 'ذخیره تغییرات' : 'ایجاد محصول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}