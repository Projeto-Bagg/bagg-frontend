import { GetStaticProps } from 'next';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function Countries() {
  const t = useTranslations();

  return <div>{t('header.countries')}</div>;
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      messages: (
        await import(
          `../messages/${context.locale === 'default' ? 'pt' : context.locale}.json`
        )
      ).default,
    },
  };
};
