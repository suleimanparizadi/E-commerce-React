import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  HelpCircle,
  Search,
  MessageCircleQuestion,
} from 'lucide-react';

const INITIAL_FORM = {
  question: '',
  answer: '',
  is_active: true,
};

export default function AdminFAQPage() {
  const { faqs, createFAQ, updateFAQ, deleteFAQ } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isLoading = faqs.isLoading;
  const faqList = faqs.data || [];

  // Filter by search
  const filteredFAQs = searchQuery.trim()
    ? faqList.filter((f) =>
        f.question?.includes(searchQuery) || f.answer?.includes(searchQuery)
      )
    : faqList;

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question || '',
      answer: faq.answer || '',
      is_active: faq.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateFAQ.mutate({ faqId: editingId, data: form });
    } else {
      createFAQ.mutate(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteFAQ.mutate(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#131212] mb-1">سوالات متداول</h1>
          <p className="text-gray-500 text-sm">مدیریت پرسش‌ها و پاسخ‌های دستیار هوشمند</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#131212] text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          سوال جدید
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="جستجوی سوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pr-10 pl-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#131212]" />
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <MessageCircleQuestion size={48} className="mx-auto mb-3 opacity-30" />
            <p>سوال متداولی یافت نشد</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <HelpCircle size={18} className="text-[#131212] flex-shrink-0" />
                      <h3 className="text-sm font-bold text-[#131212]">{faq.question}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {faq.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pr-9">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(faq)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ویرایش"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className={`p-2 rounded-lg transition-colors ${deleteConfirm === faq.id ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      title={deleteConfirm === faq.id ? 'کلیک کنید برای تأیید حذف' : 'حذف'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#131212]">
                {editingId ? 'ویرایش سوال' : 'سوال جدید'}
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
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">سوال</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full h-10 px-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">پاسخ</label>
                <textarea
                  rows={5}
                  required
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212] resize-none"
                />
              </div>

              {/* Active Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#131212] focus:ring-[#131212]"
                />
                <span className="text-sm text-gray-700">فعال (در دستیار هوشمند نمایش داده شود)</span>
              </label>

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
                  disabled={createFAQ.isPending || updateFAQ.isPending}
                  className="px-5 py-2.5 bg-[#131212] text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {createFAQ.isPending || updateFAQ.isPending ? (
                    <Loader2 size={16} className="animate-spin inline ml-2" />
                  ) : null}
                  {editingId ? 'ذخیره تغییرات' : 'ایجاد سوال'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}