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

  // Filter by search
  const filteredProducts = searchQuery.trim()
    ? productList.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productList;

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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#131212] mb-1">مدیریت محصولات</h1>
          <p className="text-gray-500 text-sm">افزودن، ویرایش و حذف محصولات فروشگاه</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#131212] text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          محصول جدید
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="جستجوی محصول..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pr-10 pl-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#131212]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>محصولی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">محصول</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">برند</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">قیمت</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">موجودی</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">دسته‌بندی</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.slug} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-[#131212]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.price
                        ? `${new Intl.NumberFormat('fa-IR').format(product.price)} تومان`
                        : '—'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.stock?.toLocaleString('fa-IR') || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ویرایش"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          className={`p-2 rounded-lg transition-colors ${deleteConfirm === product.slug ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                          title={deleteConfirm === product.slug ? 'کلیک کنید برای تأیید حذف' : 'حذف'}
                        >
                          <Trash2 size={16} />
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-[#131212]">
                {editingSlug ? 'ویرایش محصول' : 'محصول جدید'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-[#131212] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">نام محصول</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">برند</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">قیمت (تومان)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">موجودی</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* RAM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">RAM (GB)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.ram}
                    onChange={(e) => setForm({ ...form, ram: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* Storage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Storage (GB)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* GPU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">GPU</label>
                  <input
                    type="text"
                    required
                    value={form.gpu}
                    onChange={(e) => setForm({ ...form, gpu: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* Display Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">اندازه نمایشگر (اینچ)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.display_size}
                    onChange={(e) => setForm({ ...form, display_size: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">دسته‌بندی</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                  >
                    <option value="">انتخاب کنید</option>
                    {categoryList.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* CPU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">پردازنده</label>
                  <select
                    required
                    value={form.cpu}
                    onChange={(e) => setForm({ ...form, cpu: e.target.value })}
                    className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
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
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.on_board_gpu}
                    onChange={(e) => setForm({ ...form, on_board_gpu: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#131212] focus:ring-[#131212]"
                  />
                  <span className="text-sm text-gray-700">GPU آنبرد</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.touch_screen}
                    onChange={(e) => setForm({ ...form, touch_screen: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#131212] focus:ring-[#131212]"
                  />
                  <span className="text-sm text-gray-700">صفحه لمسی</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#131212] focus:ring-[#131212]"
                  />
                  <span className="text-sm text-gray-700">فعال</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">توضیحات</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="px-5 py-2.5 bg-[#131212] text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {createProduct.isPending || updateProduct.isPending ? (
                    <Loader2 size={16} className="animate-spin inline ml-2" />
                  ) : null}
                  {editingSlug ? 'ذخیره تغییرات' : 'ایجاد محصول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}