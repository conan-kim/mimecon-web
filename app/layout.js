import { LoadingProvider } from "../context/loadingContext";
import { PlatformProvider } from "../context/platformContext";
import "./globals.css";

export const metadata = {
  title: "미미콘",
  description: "여기를 눌러 미미콘을 즐겨보세요!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="whitespace-pre relative h-[100vh] break-keep">
        <LoadingProvider>
          <PlatformProvider>
            <div className="max-w-screen-md m-auto">{children}</div>
            <div id="modal-root" />
            <div id="tnc" />
          </PlatformProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
