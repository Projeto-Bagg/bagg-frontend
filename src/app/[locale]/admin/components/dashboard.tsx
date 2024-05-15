'use client';

import axios from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, ShieldAlert, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export const Dashboard = () => {
  const t = useTranslations();
  const { data } = useQuery<AdminDashboard>({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await axios.get<AdminDashboard>('admin/dashboard')).data,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div className="flex gap-2 flex-col p-4 border-2 rounded-lg">
        <div className="flex justify-between">
          <span>{t('admin.dashboard.total-users.title')}</span>
          <User className="w-8" />
        </div>
        <span className="font-bold text-lg">
          {t('admin.dashboard.total-users.label', { count: data?.totalUsers || 0 })}
        </span>
      </div>
      <div className="flex gap-2 flex-col p-4 border-2 rounded-lg">
        <div className="flex justify-between">
          <span>{t('admin.dashboard.total-posts.title')}</span>
          <MessageCircle className="w-8" />
        </div>
        <span className="font-bold text-lg">
          {t('admin.dashboard.total-posts.label', { count: data?.totalPosts || 0 })}
        </span>
      </div>
      <div className="flex gap-2 flex-col p-4 border-2 rounded-lg">
        <div className="flex justify-between">
          <span>{t('admin.dashboard.total-reports.title')}</span>
          <ShieldAlert className="w-8" />
        </div>
        <span className="font-bold text-lg">
          {t('admin.dashboard.total-reports.label', { count: data?.totalReports || 0 })}
        </span>
      </div>
    </div>
  );
};
