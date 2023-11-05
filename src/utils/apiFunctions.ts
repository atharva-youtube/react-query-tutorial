import { Post } from "./types";

export async function fetchPosts() {
  try {
    // await new Promise((res) => setTimeout(res, 3000));
    const posts: Post[] = await fetch("http://localhost:5555/posts").then(
      (res) => res.json()
    );
    return posts;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching posts at this time");
  }
}

export async function addPost(content: string) {
  try {
    await new Promise((res) => setTimeout(res, 3000));
    await fetch("http://localhost:5555/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  } catch (err) {
    console.error(err);
    throw new Error("Error adding posts at this time");
  }
}
