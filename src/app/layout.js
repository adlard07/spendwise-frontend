import { MyContextProvider } from "@/useContext/MyContext";
import "./globals.css";

export const metadata = {
  title: "SpendWise",
  description: "A handcrafted expense tracker for coffee lovers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="" suppressHydrationWarning>
        <MyContextProvider>{children}</MyContextProvider>
      </body>
    </html>
  );
}
