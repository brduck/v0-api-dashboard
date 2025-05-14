import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "created a new invoice",
    time: "2 hours ago",
  },
  {
    user: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "added a new customer",
    time: "3 hours ago",
  },
  {
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "completed a sale",
    time: "5 hours ago",
  },
  {
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "updated product inventory",
    time: "1 day ago",
  },
  {
    user: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "generated monthly report",
    time: "1 day ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{activity.user.name}</span>
            <span className="text-xs text-muted-foreground">{activity.action}</span>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
