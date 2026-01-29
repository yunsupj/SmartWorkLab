
'use client';

interface AdPlaceholderProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'vertical';
  className?: string;
  label?: string;
}

export default function AdPlaceholder({ slotId = '0000000000', format = 'auto', className = '', label = 'Advertisement' }: AdPlaceholderProps) {
  // Check if we are in production or strictly want to show placeholders
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 p-4 ${className}`} style={{ minHeight: format === 'vertical' ? '600px' : '250px' }}>
        <span className="text-xs uppercase tracking-widest font-bold">{label}</span>
        <span className="text-xs font-mono mt-2">Slot: {slotId}</span>
        <span className="text-xs font-mono">Format: {format}</span>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with real ID
           data-ad-slot={slotId}
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
      <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  );
}
