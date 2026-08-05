import { type LucideProps } from 'lucide-react';
import { type FC } from 'react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: FC<LucideProps>;
}

export default function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-12 h-12 text-slate-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-slate-400 max-w-md mx-auto">{description}</p>
      </div>
    </div>
  );
}
