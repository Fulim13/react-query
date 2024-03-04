import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* only for development,  not gonna include in production build*/}
      {/* Observer is how many component is using the react query (like todos key),
      when unmount, it will be removed from the observer list and obsever number will be decreased
       */}
      {/* 
       default cache time is 5 minutes, so if the component use that react query key have been unmounted, the cache (todos) will be removed after 5 minutes
       */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
