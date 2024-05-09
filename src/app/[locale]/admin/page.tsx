import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';
import { redirect } from '@/common/navigation';
import { getTranslations } from 'next-intl/server';
import { SelectLanguage } from '@/components/select-language';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogoutButton } from '@/app/[locale]/admin/components/logout-button';
import { TipReports } from '@/app/[locale]/admin/components/tip-reports';
import { TipCommentReports } from '@/app/[locale]/admin/components/tip-comment-reports';
import { DiaryPostReports } from '@/app/[locale]/admin/components/diary-post-reports';

export default async function Page() {
  const jwt = getCookie('bagg.sessionToken', { cookies });

  if (!jwt) {
    return redirect('/');
  }

  const currentUser = decodeJwt<UserFromJwt>(jwt);

  if (currentUser.role !== 'ADMIN') {
    return redirect('/');
  }

  const t = await getTranslations();

  return (
    <div className="max-w-[1337px] p-10 m-auto">
      <div className="p-8 border rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-2xl">Dashboard</h2>
          <div className="flex gap-2">
            <SelectLanguage />
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
        <div>
          <h2 className="font-bold mb-2 text-2xl">{t('admin.reports.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 min-h-96 overflow-y-auto">
            <div className="p-4 border rounded-lg w-full">
              <h3 className="font-semibold text-muted-foreground">
                {t('admin.reports.tip')}
              </h3>
              <TipReports />
            </div>
            <div className="p-4 border rounded-lg w-full">
              <h3 className="font-semibold text-muted-foreground">
                {t('admin.reports.tip-comments')}
              </h3>
              <TipCommentReports />
            </div>
            <div className="p-4 border rounded-lg w-full">
              <h3 className="font-semibold text-muted-foreground">
                {t('admin.reports.diary-post')}
              </h3>
              <DiaryPostReports />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
