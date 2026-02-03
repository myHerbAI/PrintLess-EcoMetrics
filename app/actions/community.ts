"use server"

import { supabase } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getPosts(limit = 10, offset = 0) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles(first_name, last_name, avatar_url),
        post_tags(tag)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Format the data to match our expected structure
    const formattedData = data.map((post) => ({
      ...post,
      author: post.profiles ? `${post.profiles.first_name} ${post.profiles.last_name}` : "Anonymous",
      avatar: post.profiles?.avatar_url || null,
      tags: post.post_tags ? post.post_tags.map((tag) => tag.tag) : [],
    }))

    return { data: formattedData, success: true }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { data: [], success: false, message: "Failed to fetch posts" }
  }
}

export async function createPost(userId: string | null, title: string, content: string, tags: string[]) {
  if (!userId) {
    return { success: false, message: "You must be logged in to create a post" }
  }

  try {
    // Insert the post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId,
          title,
          content,
        },
      ])
      .select()

    if (postError) throw postError

    // Insert tags if there are any
    if (tags.length > 0 && post && post.length > 0) {
      const tagObjects = tags.map((tag) => ({
        post_id: post[0].id,
        tag,
      }))

      const { error: tagError } = await supabase.from("post_tags").insert(tagObjects)

      if (tagError) throw tagError
    }

    revalidatePath("/community")
    return { success: true, message: "Post created successfully" }
  } catch (error) {
    console.error("Error creating post:", error)
    return { success: false, message: "Failed to create post" }
  }
}

export async function likePost(userId: string | null, postId: string) {
  if (!userId) {
    return { success: false, message: "You must be logged in to like a post" }
  }

  try {
    // Get current likes
    const { data: post, error: fetchError } = await supabase.from("posts").select("likes").eq("id", postId).single()

    if (fetchError) throw fetchError

    // Increment likes
    const { error: updateError } = await supabase
      .from("posts")
      .update({ likes: (post.likes || 0) + 1 })
      .eq("id", postId)

    if (updateError) throw updateError

    revalidatePath("/community")
    return { success: true, message: "Post liked successfully" }
  } catch (error) {
    console.error("Error liking post:", error)
    return { success: false, message: "Failed to like post" }
  }
}

export async function getComments(postId: string) {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles(first_name, last_name, avatar_url)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (error) throw error

    // Format the data
    const formattedData = data.map((comment) => ({
      ...comment,
      author: comment.profiles ? `${comment.profiles.first_name} ${comment.profiles.last_name}` : "Anonymous",
      avatar: comment.profiles?.avatar_url || null,
    }))

    return { data: formattedData, success: true }
  } catch (error) {
    console.error("Error fetching comments:", error)
    return { data: [], success: false, message: "Failed to fetch comments" }
  }
}

export async function addComment(userId: string | null, postId: string, content: string) {
  if (!userId) {
    return { success: false, message: "You must be logged in to comment" }
  }

  try {
    const { error } = await supabase.from("comments").insert([
      {
        user_id: userId,
        post_id: postId,
        content,
      },
    ])

    if (error) throw error

    revalidatePath("/community")
    return { success: true, message: "Comment added successfully" }
  } catch (error) {
    console.error("Error adding comment:", error)
    return { success: false, message: "Failed to add comment" }
  }
}
