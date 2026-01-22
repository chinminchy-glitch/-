
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
        <ShieldCheck className="text-indigo-600" size={32} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        🚀 文明病判定器
      </h1>
      <p className="text-lg text-slate-600 max-w-xl mx-auto">
        診斷計畫的「落地性」風險。別讓願景成為無法實踐的口號，讓數據與 AI 幫助你識破空談。
      </p>
    </header>
  );
};

export default Header;
