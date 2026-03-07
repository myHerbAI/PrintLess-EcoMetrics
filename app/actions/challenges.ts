"use server"

import { supabase } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getChallenges() {
  try {
    const { data, error } = await supabase.from("challenges").select("*").order("start_date", { ascending: false })

    if (error) throw error

    return { data, success: true }
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return { data: [], success: false, message: "Failed to fetch challenges" }
  }
}

export async function getActiveChallenges() {
  const today = new Date().toISOString().split("T")[0]

  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .lte("start_date", today)
      .gte("end_date", today)
      .order("end_date", { ascending: true })

    if (error) throw error

    return { data, success: true }
  } catch (error) {
    console.error("Error fetching active challenges:", error)
    return { data: [], success: false, message: "Failed to fetch active challenges" }
  }
}

export async function joinChallenge(userId: string | null, challengeId: string) {
  if (!userId) {
    return { success: false, message: "You must be logged in to join a challenge" }
  }

  try {
    const { error } = await supabase.from("user_challenges").insert([
      {
        user_id: userId,
        challenge_id: challengeId,
      },
    ])

    if (error) {
      if (error.code === "23505") {
        // Unique violation
        return { success: false, message: "You have already joined this challenge" }
      }
      throw error
    }

    revalidatePath("/challenges")
    return { success: true, message: "Successfully joined the challenge" }
  } catch (error) {
    console.error("Error joining challenge:", error)
    return { success: false, message: "Failed to join the challenge" }
  }
}

export async function getUserChallenges(userId: string | null) {
  if (!userId) {
    return { data: [], success: true }
  }

  try {
    const { data, error } = await supabase
      .from("user_challenges")
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq("user_id", userId)

    if (error) throw error

    return { data, success: true }
  } catch (error) {
    console.error("Error fetching user challenges:", error)
    return { data: [], success: false, message: "Failed to fetch user challenges" }
  }
}

export async function updateChallengeProgress(userId: string | null, challengeId: string, progress: number) {
  if (!userId) {
    return { success: false, message: "You must be logged in to update challenge progress" }
  }

  try {
    const { error } = await supabase
      .from("user_challenges")
      .update({ progress })
      .eq("user_id", userId)
      .eq("challenge_id", challengeId)

    if (error) throw error

    revalidatePath("/challenges")
    return { success: true, message: "Progress updated successfully" }
  } catch (error) {
    console.error("Error updating challenge progress:", error)
    return { success: false, message: "Failed to update challenge progress" }
  }
}
