import { LoadingProvider } from "../context/loadingContext";
import "./globals.css";

export const metadata = {
  title: "미미콘 테스트",
  description: "Generated by Conan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="whitespace-pre relative h-[100vh]">
        <LoadingProvider>
          <div className="max-w-screen-md m-auto">{children}</div>
          <div id="modal-root" />
        </LoadingProvider>
      </body>
    </html>
  );
}
