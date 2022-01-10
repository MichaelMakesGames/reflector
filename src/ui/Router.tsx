import React, { useState } from "react";

export interface RouterPageProps {
  navigateTo: (page: string) => void;
  goBack: () => void;
}

export default function Router({
  pages,
  defaultPage,
}: {
  pages: Record<string, React.FunctionComponent<RouterPageProps> | undefined>;
  defaultPage: string;
}) {
  const [stack, setStack] = useState<string[]>([defaultPage]);
  const Page = pages[stack[0]];

  const navigateTo = (page: string) => {
    if (page !== stack[0]) setStack([page, ...stack]);
  };
  const goBack = () => {
    if (stack.length > 1) setStack(stack.slice(1));
  };
  const pageProps: RouterPageProps = { navigateTo, goBack };

  if (Page) {
    return <Page {...pageProps} />;
  } else {
    console.error(`Unroutable page: ${stack[0]}`);
    return null;
  }
}
