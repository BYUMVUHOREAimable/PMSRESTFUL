import React from "react";
import PagesRouter from "./routes";
import { CommonProvider } from "./context";
import { Toaster } from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";

const App = () => {
  return (
    <React.Suspense
      fallback={
        <div className="w-full bg-slate-200 h-screen flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full bg-slate-200 h-screen flex justify-center items-center">
              <div className="flex flex-col items-center justify-center">
                <BiLoaderAlt
                  size={64}
                  className="animate-spin text-primary-blue"
                />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CommonProvider>
        <Toaster position="top-center" />
        <PagesRouter />
      </CommonProvider>
    </React.Suspense>
  );
};

export default App;
