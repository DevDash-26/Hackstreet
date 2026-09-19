import { RouterProvider } from 'react-router-dom';
import { Providers } from '@/app/providers';
import { appRouter } from '@/app/router';

function App() {
  return (
    <Providers>
      <RouterProvider router={appRouter} />
    </Providers>
  );
}

export default App;
