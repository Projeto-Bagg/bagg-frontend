'use client';

import { DiaryPostReports } from '@/app/[locale]/admin/diary-post-reports';
import { TipCommentReports } from '@/app/[locale]/admin/tip-comment-reports';
import { TipReports } from '@/app/[locale]/admin/tip-reports';
import { useAuth } from '@/context/auth-context';
import React from 'react';

export const Admin = () => {
  const auth = useAuth();

  return (
    <div className="max-w-[1337px] p-10 m-auto">
      <div className="p-8 border rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-2xl">Dashboard</h2>
          <button onClick={() => auth.logout()} className="font-bold">
            Deslogar
          </button>
        </div>
        <div>
          <h2 className="font-bold text-2xl">Denúncias</h2>
          <div className="grid grid-cols-3 gap-x-4">
            <div className="p-4 border rounded-lg w-full">
              <h3 className="font-semibold text-muted-foreground">Tip</h3>
              <div className="divide-y">
                <TipReports />
              </div>
            </div>
            <div className="p-4 border rounded-lg w-full">
              <h3 className="font-semibold text-muted-foreground">Comentários</h3>
              <div className="divide-y">
                <TipCommentReports />
              </div>
            </div>
            <div className="p-4 border rounded-lg w-full">
              <h3 className="font-semibold text-muted-foreground">Postagens de diário</h3>
              <div className="divide-y">
                <DiaryPostReports />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
