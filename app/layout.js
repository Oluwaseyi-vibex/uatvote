import "./globals.css";
import { Toaster } from "react-hot-toast";
import { poppins } from "@/utils/font";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export const metadata = {
  title: "UNI POLLING",
  description: "University e-voting system by oluwaseyifunmi ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} w-full bg-black bg-no-repeat bg-cover text-gray-900 antialiased  h-full`}
      >
        <MantineProvider>
          <Toaster />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
