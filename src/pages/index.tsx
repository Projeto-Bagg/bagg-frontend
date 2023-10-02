import { useRouter } from 'next/router';
import { Header } from '../components/header';
import { GetStaticProps } from 'next';

export default function Home() {
  const router = useRouter();

  return (
    <main className={``}>
      <Header />
    </main>
  );
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
