"use server"

import { supabase } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export type ActivityData = {
  type: "transportation" | "home" | "food" | "consumption"
  value: number
  date: string
  details?: Record<string, any>
}

export async function logActivity(userId: string | null, data: ActivityData) {
  // For guest users, store in local storage (handled client-side)
  if (!userId) {
    return { success: true, message: "Activity logged for guest user" }
  }

  try {
    // Get the current date's record if it exists
    const { data: existingData, error: fetchError } = await supabase
      .from("carbon_footprints")
      .select("*")
      .eq("user_id", userId)
      .eq("date", data.date)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      throw fetchError
    }

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from("carbon_footprints")
        .update({
          [data.type]: existingData[data.type] + data.value,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id)

      if (error) throw error
    } else {
      // Create new record
      const { error } = await supabase.from("carbon_footprints").insert([
        {
          user_id: userId,
          [data.type]: data.value,
          date: data.date,
        },
      ])

      if (error) throw error
    }

    revalidatePath("/dashboard")
    return { success: true, message: "Activity logged successfully" }
  } catch (error) {
    console.error("Error logging activity:", error)
    return { success: false, message: "Failed to log activity" }
  }
}

export async function getCarbonFootprint(userId: string | null, startDate: string, endDate: string) {
  if (!userId) {
    return { data: [], success: true }
  }

  try {
    const { data, error } = await supabase
      .from("carbon_footprints")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })

    if (error) throw error

    return { data, success: true }
  } catch (error) {
    console.error("Error fetching carbon footprint:", error)
    return { data: [], success: false, message: "Failed to fetch carbon footprint data" }
  }
}

export async function getTotalCarbonFootprint(userId: string | null) {
  if (!userId) {
    return { data: null, success: true }
  }

  try {
    const { data, error } = await supabase
      .from("carbon_footprints")
      .select("transportation, home_energy, food, consumption")
      .eq("user_id", userId)

    if (error) throw error

    // Calculate totals
    const totals = {
      transportation: 0,
      home_energy: 0,
      food: 0,
      consumption: 0,
    }

    data.forEach((item) => {
      totals.transportation += item.transportation || 0
      totals.home_energy += item.home_energy || 0
      totals.food += item.food || 0
      totals.consumption += item.consumption || 0
    })

    const total = totals.transportation + totals.home_energy + totals.food + totals.consumption

    return {
      data: {
        ...totals,
        total,
      },
      success: true,
    }
  } catch (error) {
    console.error("Error fetching total carbon footprint:", error)
    return { data: null, success: false, message: "Failed to fetch total carbon footprint data" }
  }
}
