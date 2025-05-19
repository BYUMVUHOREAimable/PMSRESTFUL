import { ThemeProvider } from "@mui/material/styles";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./pages/500/ErrorBoundary";
import { persistor, store } from "./redux/store";
import THEME from "./theme";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.layer.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    {" "}
    {/* Redux provider should wrap the entire app */}
    <PersistGate persistor={persistor} loading={null}>
      <ErrorBoundary>
        {" "}
        {/* ErrorBoundary should wrap components using Redux */}
        <MantineProvider>
          <ThemeProvider theme={THEME}>
            <App />
          </ThemeProvider>
        </MantineProvider>
      </ErrorBoundary>
    </PersistGate>
  </Provider>,
);
