import { useState, useRef, useEffect } from 'react';
import { useAssistant } from '../hooks/useAssistant';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

export default function AssistantPage() {
  const { chat } = useAssistant();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'سلام! من دستیار هوشمند فروشگاه لپ‌تاپ هستم. چطور می‌توانم به شما کمک کنم؟ می‌توانید درباره مشخصات لپ‌تاپ، قیمت، یا پیشنهاد خرید از من سوال بپرسید.',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || chat.isPending) return;

    const userMessage = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    chat.mutate(
      { user_message: userMessage },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: data.response || data },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-40px)] px-4 lg:px-0">
      {/* Header - Amado Style */}
      <div className="bg-white border border-gray-100 p-6 mb-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-amado-primary flex items-center justify-center">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg text-amado-dark font-normal uppercase">دستیار هوشمند</h1>
          <p className="text-xs text-gray-500">پاسخگوی سوالات شما درباره لپ‌تاپ</p>
        </div>
        {chat.isPending && (
          <span className="mr-auto text-xs text-gray-400 flex items-center gap-1">
            <Loader2 size={12} className="animate-spin" />
            در حال تایپ...
          </span>
        )}
      </div>

      {/* Messages - Amado Style */}
      <div className="flex-1 overflow-y-auto bg-white border border-gray-100 p-6 mb-4 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-amado-bg' : 'bg-amado-primary'
              }`}
            >
              {msg.role === 'user' ? (
                <User size={18} className="text-amado-dark" />
              ) : (
                <Bot size={18} className="text-white" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[80%] p-6 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amado-dark text-white'
                  : 'bg-amado-bg text-amado-dark'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Amado Style */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 p-4 flex gap-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 px-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
          disabled={chat.isPending}
        />
        <button
          type="submit"
          disabled={!input.trim() || chat.isPending}
          className="w-14 h-14 bg-amado-primary text-white flex items-center justify-center hover:bg-amado-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {chat.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}