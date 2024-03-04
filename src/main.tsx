import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient(
//   {
//   defaultOptions: {
//     queries: {
//       retry: 3,
//       cacheTime: 1000 * 60 * 5, // 5 minutes
//       staleTime: 10 * 1000, // how long the data is considered fresh, default is 0, so it will always refetch the fresh data from the backend when the component is mounted, if the data is older than 10 seconds, it will refetch the data again when the component is mounted again
//       // Stale Automatically refetches the data
//       // 1. When the network is reconnected
//       refetchOnReconnect: false, // default is true
//       // 2. When the window is refocused (if we open a new tab and then go back to the previous tab, it will refetch the data again)
//       refetchOnWindowFocus: false, // default is true
//       // 3. When a component is mounted
//       refetchOnMount: false, // default is true
//     },
//   },
// }
);

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
