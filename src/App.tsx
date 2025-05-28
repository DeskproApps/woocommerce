/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { Main } from "./pages/Main";

import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";

import { LoadingSpinner } from "@deskpro/app-sdk";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import { Suspense } from "react";
import { Redirect } from "./components/Redirect/Redirect";
import { query } from "./utils/query";
import { View } from "./pages/View/View";
import { CreateNote } from "./pages/Create/CreateNote";
import { Edit } from "./pages/Edit/Edit";
import { ErrorBoundary } from "@sentry/react";

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={query}>
        <Suspense fallback={<LoadingSpinner />}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} fallback={ErrorFallback}>
                <Routes>
                  <Route path="/view/:type/:id" element={<View />} />
                  <Route path="/edit/:type/:id" element={<Edit />} />
                  <Route path="/create/note/:orderId" element={<CreateNote />} />
                  <Route path="/redirect" element={<Redirect />} />
                  <Route index element={<Main />} />
                </Routes>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Suspense>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
