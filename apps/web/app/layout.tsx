import "./globals.css";

export const metadata = {
  title: "Nurse Bulao — Premium Home Care",
  description: "Trusted nurses and caregivers at home, booked around your schedule.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
