import { Metadata } from 'next';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  feed: ReactNode;
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  return {
    title: `Bagg - ${params.slug}`,
    openGraph: {
      title: `Bagg - ${params.slug}`,
    },
  };
}

export default function Layout(props: Props) {
  return (
    <div className="p-4 container">
      {props.children}
      {props.feed}
    </div>
  );
}
