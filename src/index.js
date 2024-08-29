// ** React Imports
import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// ** Redux Imports
import { store } from "./redux/store";
import { Provider } from "react-redux";

// ** ThemeColors Context
import { ThemeColors } from "./utility/context/ThemeColors"; // Ensure the import name matches your export

// ** ThemeConfig
import themeConfig from "./configs/themeConfig";

// ** Toast
import { Toaster } from "react-hot-toast";

// ** Spinner (Splash Screen)
import Spinner from "./@core/components/spinner/Fallback-spinner";

// ** Ripple Button
import "./@core/components/ripple-button";

// ** PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx.min";

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

// ** React Hot Toast Styles
import "@styles/react/libs/react-hot-toasts/react-hot-toasts.scss";

// ** Core styles
import "./@core/assets/fonts/feather/iconfont.css";
import "./@core/scss/core.scss";
import "./assets/scss/style.scss";
import "react-toastify/dist/ReactToastify.min.css";
import "react-phone-input-2/lib/style.css";

// ** Service Worker
import * as serviceWorker from "./serviceWorker";

// ** Lazy load app
const LazyApp = lazy(() => import("./App"));

// Mine
import "./styles.css";

// internationaliztion

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import geTranslation from "./locales/ge.json";

// initialization
i18n.use(initReactI18next).init({
  resources: {
    ge: { translation: geTranslation },
  },
  lng: "ge",
  fallback: "en",
  interpolation: { escapeValue: false },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <ThemeColors.Provider>
          <LazyApp />
          <Toaster
            position={themeConfig.layout.toastPosition}
            toastOptions={{ className: "react-hot-toast" }}
          />
        </ThemeColors.Provider>
      </Suspense>
    </Provider>
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();