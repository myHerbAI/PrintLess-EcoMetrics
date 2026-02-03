"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Info } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TipCardProps {
  id: string
  title: string
  description: string
  category: string
  impact: "Low" | "Medium" | "High"
  content?: string // Full content for the dialog
  averages?: {
    national?: number
    global?: number
    sustainable?: number
  }
  metrics?: {
    unit: string
    value: number
  }
  onSaveStatusChange?: (id: string, isPinned: boolean) => void
}

export function TipCard({
  id,
  title,
  description,
  category,
  impact,
  content,
  averages,
  metrics,
  onSaveStatusChange,
}: TipCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, isGuest } = useAuth()
  const { toast } = useToast()

  // Generate some default content if none is provided
  const fullContent =
    content ||
    `
    <p>${description}</p>
    <h3 class="text-lg font-semibold mt-4">Why This Matters</h3>
    <p>Making sustainable choices in our daily lives helps reduce our environmental footprint and contributes to a healthier planet.</p>
    <h3 class="text-lg font-semibold mt-4">How to Implement</h3>
    <p>Start with small changes in your routine. Even minor adjustments can have a significant positive impact when adopted consistently.</p>
    <h3 class="text-lg font-semibold mt-4">Benefits</h3>
    <ul class="list-disc pl-5 mt-2">
      <li>Reduces your carbon footprint</li>
      <li>Conserves natural resources</li>
      <li>Promotes a healthier environment</li>
      <li>Often leads to cost savings over time</li>
    </ul>
  `

  // Check if the tip is pinned on component mount
  useEffect(() => {
    const checkIfPinned = async () => {
      try {
        if (isGuest) {
          // Check localStorage for guest users
          const savedTips = JSON.parse(localStorage.getItem("guestSavedTips") || "[]")
          const isTipSaved = savedTips.some((tip: any) => tip.id === id)
          setIsPinned(isTipSaved)
        } else if (user) {
          // Check Supabase for authenticated users
          const { data, error } = await supabase
            .from("user_tips")
            .select("*")
            .eq("user_id", user.id)
            .eq("tip_id", id)
            .single()

          if (error && error.code !== "PGRST116") {
            // PGRST116 is "no rows returned" which is fine
            console.error("Error checking if tip is pinned:", error)
          }

          setIsPinned(!!data)
        }
      } catch (error) {
        console.error("Error checking if tip is pinned:", error)
      }
    }

    checkIfPinned()
  }, [id, user, isGuest])

  // Toggle pin status
  const togglePin = async () => {
    setIsLoading(true)

    try {
      if (isPinned) {
        // Unpin the tip
        if (isGuest) {
          // Remove from localStorage for guest users
          const savedTips = JSON.parse(localStorage.getItem("guestSavedTips") || "[]")
          const updatedTips = savedTips.filter((tip: any) => tip.id !== id)
          localStorage.setItem("guestSavedTips", JSON.stringify(updatedTips))
        } else if (user) {
          // Remove from Supabase for authenticated users
          const { error } = await supabase.from("user_tips").delete().eq("user_id", user.id).eq("tip_id", id)

          if (error) throw error
        }

        toast({
          title: "Tip Unpinned",
          description: "The tip has been removed from your saved collection",
        })
      } else {
        // Pin the tip
        if (isGuest) {
          // Save to localStorage for guest users
          const savedTips = JSON.parse(localStorage.getItem("guestSavedTips") || "[]")
          savedTips.push({
            id,
            title,
            description,
            category,
            impact,
            averages,
            metrics,
            savedAt: new Date().toISOString(),
          })
          localStorage.setItem("guestSavedTips", JSON.stringify(savedTips))
        } else if (user) {
          // Save to Supabase for authenticated users
          const { error } = await supabase.from("user_tips").insert([
            {
              user_id: user.id,
              tip_id: id,
              saved_at: new Date().toISOString(),
              metadata: {
                title,
                description,
                category,
                impact,
                averages,
                metrics,
              },
            },
          ])

          if (error) throw error
        }

        toast({
          title: "Tip Pinned",
          description: "The tip has been added to your saved collection",
        })
      }

      // Update local state
      setIsPinned(!isPinned)

      // Notify parent component if callback exists
      if (onSaveStatusChange) {
        onSaveStatusChange(id, !isPinned)
      }
    } catch (error) {
      console.error("Error toggling pin status:", error)
      toast({
        title: "Error",
        description: "Failed to update your saved tips",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get impact color
  const getImpactColor = () => {
    switch (impact) {
      case "High":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
      case "Medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100"
      case "Low":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <>
      <Card className="transition-all hover:shadow-md flex flex-col h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
            >
              {category}
            </Badge>
            <Badge
              variant={impact === "Low" ? "outline" : impact === "Medium" ? "secondary" : "default"}
              className={getImpactColor()}
            >
              {impact} Impact
            </Badge>
          </div>
          <CardTitle className="mt-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        {(metrics || averages) && (
          <CardContent className="pt-0">
            {metrics && (
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="font-medium">Metric:</span>
                <span>
                  {metrics.value} {metrics.unit}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Measurement for this sustainability tip</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            {averages && (
              <div className="mt-2 text-sm">
                <div className="font-medium mb-1">Compared to averages:</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {averages.national && (
                    <div className="p-1 bg-slate-50 dark:bg-slate-900 rounded">
                      <div className="font-medium">National</div>
                      <div>{averages.national}</div>
                    </div>
                  )}
                  {averages.global && (
                    <div className="p-1 bg-slate-50 dark:bg-slate-900 rounded">
                      <div className="font-medium">Global</div>
                      <div>{averages.global}</div>
                    </div>
                  )}
                  {averages.sustainable && (
                    <div className="p-1 bg-emerald-50 dark:bg-emerald-900/30 rounded">
                      <div className="font-medium">Sustainable</div>
                      <div>{averages.sustainable}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}

        <CardFooter className="flex justify-between mt-auto">
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            Read More
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePin}
            disabled={isLoading}
            className={isPinned ? "text-emerald-600" : ""}
          >
            <Bookmark className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
            <span className="sr-only">{isPinned ? "Unpin tip" : "Pin tip"}</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
              >
                {category}
              </Badge>
              <Badge
                variant={impact === "Low" ? "outline" : impact === "Medium" ? "secondary" : "default"}
                className={getImpactColor()}
              >
                {impact} Impact
              </Badge>
            </div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Eco-friendly tip to help reduce your environmental impact</DialogDescription>
          </DialogHeader>

          {(metrics || averages) && (
            <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
              {metrics && (
                <div>
                  <div className="font-medium text-sm">Metric</div>
                  <div className="text-lg">
                    {metrics.value} {metrics.unit}
                  </div>
                </div>
              )}

              {averages && Object.keys(averages).length > 0 && (
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">Compared to averages:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {averages.national && (
                      <div>
                        <div className="text-xs text-muted-foreground">National</div>
                        <div>{averages.national}</div>
                      </div>
                    )}
                    {averages.global && (
                      <div>
                        <div className="text-xs text-muted-foreground">Global</div>
                        <div>{averages.global}</div>
                      </div>
                    )}
                    {averages.sustainable && (
                      <div>
                        <div className="text-xs text-muted-foreground">Sustainable Target</div>
                        <div className="text-emerald-600 dark:text-emerald-400">{averages.sustainable}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4" dangerouslySetInnerHTML={{ __html: fullContent }} />
          <div className="mt-4 flex justify-end">
            <Button
              variant={isPinned ? "default" : "outline"}
              className={isPinned ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              onClick={togglePin}
              disabled={isLoading}
            >
              <Bookmark className={`mr-2 h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
              {isPinned ? "Pinned" : "Pin This Tip"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
