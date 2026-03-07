"use server"

import { supabase } from "@/lib/supabase-server"

export async function getSavedTips(userId: string | null) {
  if (!userId) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("user_tips")
      .select(`
        *,
        tip:tips(*)
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching saved tips:", error)
      return []
    }

    return data.map((item) => item.tip)
  } catch (error) {
    console.error("Error fetching saved tips:", error)
    return []
  }
}

export async function getActiveChallenges(userId: string | null) {
  if (!userId) {
    return []
  }

  const today = new Date().toISOString().split("T")[0]

  try {
    const { data, error } = await supabase
      .from("user_challenges")
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq("user_id", userId)
      .lte("challenge.start_date", today)
      .gte("challenge.end_date", today)

    if (error) {
      console.error("Error fetching active challenges:", error)
      return []
    }

    return data.map((item) => item.challenge)
  } catch (error) {
    console.error("Error fetching active challenges:", error)
    return []
  }
}
