import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const data = [
  {
    id: "INV001",
    name: "Alex Johnson",
    email: "alex@example.com",
    amount: "$350.00",
    status: "success",
    date: "2023-11-14",
  },
  {
    id: "INV002",
    name: "Sarah Williams",
    email: "sarah@example.com",
    amount: "$125.00",
    status: "pending",
    date: "2023-11-13",
  },
  {
    id: "INV003",
    name: "Michael Brown",
    email: "michael@example.com",
    amount: "$450.00",
    status: "success",
    date: "2023-11-12",
  },
  {
    id: "INV004",
    name: "Emily Davis",
    email: "emily@example.com",
    amount: "$275.00",
    status: "failed",
    date: "2023-11-11",
  },
  {
    id: "INV005",
    name: "David Wilson",
    email: "david@example.com",
    amount: "$180.00",
    status: "success",
    date: "2023-11-10",
  },
]

export function DataTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={row.name} />
                    <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-xs text-muted-foreground">{row.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={row.status === "success" ? "success" : row.status === "pending" ? "outline" : "destructive"}
                  className={
                    row.status === "success"
                      ? "bg-emerald-100 text-emerald-800"
                      : row.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                  }
                >
                  {row.status === "success" ? "Paid" : row.status === "pending" ? "Pending" : "Failed"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
