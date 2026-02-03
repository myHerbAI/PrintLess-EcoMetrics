import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChallengeCardProps {
  title: string
  description: string
  participants: number
  daysLeft: number
  difficulty: "Easy" | "Medium" | "Hard"
}

export function ChallengeCard({ title, description, participants, daysLeft, difficulty }: ChallengeCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <Badge
            variant={difficulty === "Easy" ? "default" : difficulty === "Medium" ? "secondary" : "destructive"}
            className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800"
          >
            {difficulty}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participants} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{daysLeft} days left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Join Challenge</Button>
      </CardFooter>
    </Card>
  )
}
