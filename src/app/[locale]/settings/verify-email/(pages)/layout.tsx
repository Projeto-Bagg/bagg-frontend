import { getCookie } from 'cookies-next';
import { Mail } from 'lucide-react';
import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from '@/common/navigation';

export default function Layout({ children }: { children: ReactNode }) {
  const tempAcessToken = getCookie('bagg.tempSessionToken', { cookies });

  if (!tempAcessToken) {
    return redirect('/');
  }

  return (
    <div className="p-4 container max-w-xl m-auto my-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-primary p-4">
          <Mail className="w-[40px] h-[40px]" />
        </div>
        {children}
      </div>
    </div>
  );
}
