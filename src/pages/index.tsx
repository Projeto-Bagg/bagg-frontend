import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import CreateTip from '../components/create-tip';

export default function Home() {
  const router = useRouter();

  return (
    <main>
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
