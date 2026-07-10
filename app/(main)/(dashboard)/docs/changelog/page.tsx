import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { GitBranchIcon } from "@hugeicons/core-free-icons"

interface Commit {
  hash: string
  date: string
  message: string
}

async function getCommits(): Promise<Commit[]> {
  const { execSync } = await import("child_process")
  try {
    const output = execSync("git log --format='%H|%ai|%s' --no-decorate -50", {
      encoding: "utf-8",
    })
    return output
      .trim()
      .split("\n")
      .map((line: string) => {
        const [hash, date, ...msgParts] = line.split("|")
        let message = msgParts.join("|")
        const typeMap: Record<string, string> = {
          feat: "New Feature",
          fix: "Bug Fix",
          chore: "Maintenance",
          docs: "Documentation",
          refactor: "Refactor",
          style: "Style",
          test: "Testing",
          perf: "Performance",
        }
        const match = message.match(/^(\w+)(\(.+\))?:\s?(.*)/)
        if (match) {
          const type = typeMap[match[1]] || match[1]
          message = `${type}: ${match[3] || match[2] || ""}`
        }
        return { hash: hash.substring(0, 7), date, message }
      })
  } catch {
    return []
  }
}

export default async function ChangelogPage() {
  const commits = await getCommits()

  const grouped: Record<string, Commit[]> = {}
  for (const commit of commits) {
    const day = commit.date.split(" ")[0]
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(commit)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changelog</CardTitle>
      </CardHeader>
      <CardContent>
        {commits.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No changelog available.
          </p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([day, dayCommits]) => (
              <div key={day}>
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  {new Date(day).toLocaleDateString("en-ZA", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="space-y-3">
                  {dayCommits.map((commit) => (
                    <div key={commit.hash} className="flex items-start gap-3">
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <HugeiconsIcon
                          icon={GitBranchIcon}
                          className="size-3.5 text-muted-foreground"
                        />
                        <code className="text-[11px] text-muted-foreground">
                          {commit.hash}
                        </code>
                      </div>
                      <p className="text-sm">{commit.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
