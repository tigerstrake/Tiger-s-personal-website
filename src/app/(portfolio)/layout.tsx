import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BridgeEasterEgg from "@/components/BridgeEasterEgg";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <BridgeEasterEgg />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

