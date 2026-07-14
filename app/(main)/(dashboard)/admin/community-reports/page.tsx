import { HugeiconsIcon } from "@hugeicons/react"
import { ShieldBanIcon } from "@hugeicons/core-free-icons"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { getAllReports } from "@/lib/actions/admin/community-reports"
import { ReportTable, type Report } from "@/components/admin/community-reports/report-table"

const AdminReportsPage = async () => {
  const { data: reports } = await getAllReports()

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
    >
      <div className="mb-5">
        <Heading
          as="h1"
          font={"none"}
          size={"4xl"}
          weight={"semibold"}
          tracking={"normal"}
          leading={"normal"}
          transform={"normal"}
          italic={false}
          margin={"none"}
        >
          Community Reports
        </Heading>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="my-40 flex flex-col items-center justify-center">
          <Heading size="sm" margin="md">
            No Reports
          </Heading>
          <HugeiconsIcon icon={ShieldBanIcon} className="size-20 text-muted-foreground" />
        </div>
      ) : (
        <ReportTable reports={reports as unknown as Report[]} />
      )}
    </Container>
  )
}

export default AdminReportsPage
