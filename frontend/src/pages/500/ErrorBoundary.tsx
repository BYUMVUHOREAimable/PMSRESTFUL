import React, { Component, ErrorInfo } from "react";
import { Helmet } from "react-helmet";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full flex flex-col min-h-screen justify-between">
          <div className="w-full flex flex-col">
            <div
              className={`flex flex-col w-full ${
                window.location.pathname !== "/" &&
                "px-2 sm:px-8 md:px-12 lg:px-16"
              } mt-6`}
            >
              <div className="w-full">
                <Helmet>
                  <title>500 | PMS</title>
                </Helmet>
                <main className="w-full flex items-center justify-center flex-col pt-12 pb-16">
                  <section className="relative flex flex-col">
                    <div className="text-[#263048] text-[200px] font-bold z-[1] px-6">
                      500
                    </div>
                    <div className="absolute bg-secondary-gray bottom-12 h-[30%] w-full"></div>
                  </section>
                  <section className="flex flex-col items-center space-y-3 pb-8">
                    <h2 className="text-primary-black font-medium text-2xl">
                      Internal Server Error :(
                    </h2>
                    <p className="text-gray-primary text-center max-w-md text-[18px]">
                      We are very sorry. Our team is working on fixing this as
                      soon as possible
                    </p>
                  </section>
                  <a href="/">
                    <button className="text-white bg-primary-blue rounded py-3 px-8 text-lg">
                      Back To Home Page
                    </button>
                  </a>
                </main>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
