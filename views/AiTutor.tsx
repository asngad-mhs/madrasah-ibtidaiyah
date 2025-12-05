
import React, { useState, useRef, useEffect } from 'react';
import { askAiTutor } from '../services/geminiService.ts';
import MoonIcon from '../components/icons/MoonIcon.tsx';
import SunIcon from '../components/icons/SunIcon.tsx';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AiTutorProps {
  initialText?: string | null;
}

const AiTutor: React.FC<AiTutorProps> = ({ initialText }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Assalamualaikum! Ada yang bisa Ustadz AI bantu? Silakan bertanya tentang pelajaran atau apa saja yang ingin kamu ketahui." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialText) {
      setInput(initialText);
    }
  }, [initialText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await askAiTutor(input);
    const aiMessage: Message = { sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="grid grid-cols-3 items-center mb-4">
        <div className="col-start-2 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tanya Ustadz AI</h1>
        </div>
        <div className="col-start-3 flex justify-end">
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle Dark Mode"
            >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
              msg.sender === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm dark:bg-gray-700 dark:text-gray-200'
            }`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-2xl bg-white dark:bg-gray-700 text-gray-800 rounded-bl-none shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-300 dark:bg-teal-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-teal-300 dark:bg-teal-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-teal-300 dark:bg-teal-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pertanyaanmu..."
          disabled={isLoading}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="ml-3 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-teal-300 dark:disabled:bg-teal-400 transition-colors shadow-md"
          aria-label="Kirim Pesan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AiTutor;