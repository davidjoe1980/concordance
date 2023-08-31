import React from "react";
import ReactDOM from "react-dom/client";
import {QueryClient, QueryClientProvider} from "react-query";
import App from "./App";

const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            // refetchOnMount: false,
            // refetchOnReconnect: false,
            // refetchOnWindowFocus: false,
            // retry:false
        }
    }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  </React.StrictMode>
);