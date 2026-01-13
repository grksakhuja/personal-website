import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Increment and fetch view count on mount
    fetch('/api/views')
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => setViews(null));
  }, []);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-2 text-[#737373] text-sm">
      <Eye size={14} />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
