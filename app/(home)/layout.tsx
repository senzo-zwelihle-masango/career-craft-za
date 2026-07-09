import FooterMenu from "@/components/home/footer"
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
