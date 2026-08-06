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
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronLeft,
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
        f.question?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.answer?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqList;

  // Calculate stats
  const totalFAQs = faqList.length;
  const activeFAQs = faqList.filter(f => f.is_active).length;
  const inactiveFAQs = faqList.filter(f => !f.is_active).length;

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

  // Quick stats cards
  const stats = [
    {
      label: 'کل سوالات',
      value: totalFAQs,
      icon: MessageCircleQuestion,
      bgColor: 'bg-blue-600',
      iconBg: 'bg-blue-500',
      shadow: 'shadow-blue-200',
    },
    {
      label: 'سوالات فعال',
      value: activeFAQs,
      icon: CheckCircle,
      bgColor: 'bg-[#fbb710]',
      iconBg: 'bg-[#e5a50f]',
      shadow: 'shadow-yellow-200',
      textColor: 'text-[#131212]',
    },
    {
      label: 'سوالات غیرفعال',
      value: inactiveFAQs,
      icon: XCircle,
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
                <HelpCircle size={22} className="text-white" />
              </span>
              سوالات متداول
            </h1>
            <p className="text-blue-500 text-sm mr-13">مدیریت پرسش‌ها و پاسخ‌های دستیار هوشمند</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md shadow-blue-200 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            سوال جدید
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
              placeholder="جستجوی سوال یا پاسخ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-10 pl-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <TrendingUp size={16} />
            <span>{filteredFAQs.length} سوال یافت شد</span>
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-50 border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:400ms]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <HelpCircle size={20} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-blue-600 font-medium animate-pulse">بارگذاری سوالات...</p>
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <MessageCircleQuestion size={40} className="text-blue-300" />
            </div>
            <p className="text-gray-400 font-medium">سوال متداولی یافت نشد</p>
            <p className="text-sm text-gray-300 mt-1">
              {searchQuery ? 'با جستجوی دیگری امتحان کنید' : 'برای شروع، سوال جدید اضافه کنید'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-blue-50">
            {filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className={`
                  p-6 hover:bg-blue-50/30 transition-all duration-300 group
                  ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/5'}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                        <HelpCircle size={16} className="text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-[#131212] group-hover:text-blue-600 transition-colors">
                        {faq.question}
                      </h3>
                      <span className={`
                        inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${faq.is_active 
                          ? 'bg-green-100 text-green-700 border border-green-200 hover:shadow-md' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }
                        transition-all duration-300 hover:scale-105
                      `}>
                        {faq.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pr-11">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => openEdit(faq)}
                      className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                      title="ویرایش"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className={`
                        p-2 rounded-lg transition-all duration-300
                        ${deleteConfirm === faq.id 
                          ? 'text-red-600 bg-red-50 scale-110' 
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-110'
                        }
                      `}
                      title={deleteConfirm === faq.id ? 'کلیک کنید برای تأیید حذف' : 'حذف'}
                    >
                      <Trash2 size={16} />
                    </button>
                    {deleteConfirm === faq.id && (
                      <span className="text-xs text-red-500 font-medium animate-pulse mr-1">
                        تأیید?
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-blue-100 animate-slideDown">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                  {editingId ? (
                    <Pencil size={16} className="text-white" />
                  ) : (
                    <Plus size={16} className="text-white" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-[#131212]">
                  {editingId ? 'ویرایش سوال' : 'سوال جدید'}
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
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1.5">سوال</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full h-10 px-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
                  placeholder="سوال مورد نظر را وارد کنید..."
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1.5">پاسخ</label>
                <textarea
                  rows={5}
                  required
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50 resize-none"
                  placeholder="پاسخ سوال را وارد کنید..."
                />
              </div>

              {/* Active Checkbox */}
              <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 rounded-xl p-4 border border-blue-100">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 transition-all group-hover:scale-110"
                  />
                  <span className="text-sm text-blue-700 group-hover:text-blue-900 transition-colors">
                    فعال (در دستیار هوشمند نمایش داده شود)
                  </span>
                </label>
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
                  disabled={createFAQ.isPending || updateFAQ.isPending}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:transform-none shadow-md shadow-blue-200 flex items-center gap-2"
                >
                  {createFAQ.isPending || updateFAQ.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ChevronLeft size={16} />
                  )}
                  {editingId ? 'ذخیره تغییرات' : 'ایجاد سوال'}
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