import { useRouter } from 'next/router';
import { Header } from '../components/header';
import { GetStaticProps } from 'next';
import CreateTip from '../components/create-tip';

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <Header />
      <CreateTip />
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
