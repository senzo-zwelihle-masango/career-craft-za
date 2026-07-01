import FooterMenu from "@/components/home/footer-menu"
import NavigationMenu from "@/components/home/navigation-menu"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <NavigationMenu />
      {children}
      <FooterMenu/>
    </main>
  )
}
