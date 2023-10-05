import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

export default function Profile() {
  const router = useRouter();

  return (
    <>
      <NextSeo title={router.query.slug && 'Perfil de ' + router.query.slug} />
      <div>{router.query.slug}</div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

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
