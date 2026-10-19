export interface AppProps {
  title?: string;
}

export function App({ title = 'ecommerce-stpeterv2-frontend' }: AppProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}