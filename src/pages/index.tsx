import Image from "next/image";
import { Inter } from "next/font/google";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addPost, fetchPosts } from "@/utils/apiFunctions";
import { useState } from "react";
import { queryClient } from "./_app";
import { Post } from "@/utils/types";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  posts: Post[];
};

export default function Home(props: Props) {
  const [content, setContent] = useState("");

  const {
    data: posts,
    error,
    isLoading: isPostsLoading,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    initialData: props.posts,
  });

  const { mutateAsync, isPending: isAddingPost } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const handleAddPost = async () => {
    try {
      await mutateAsync(content);
      setContent("");
    } catch (err) {
      console.error(err);
      alert("There was an error adding your post");
    }
  };

  return (
    <div className="p-10">
      <div className="flex">
        <input
          type="text"
          placeholder="Write about your day..."
          className="border border-gray-300 rounded-md px-4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleAddPost}
          disabled={isAddingPost}
          className="ml-2 px-4 py-2 text-white bg-green-600 rounded-md"
        >
          {isAddingPost ? "Adding..." : "Add Post"}
        </button>
      </div>

      {isPostsLoading && <p>Loading...</p>}
      {error && <p>Error fetching posts!</p>}
      {posts?.map((post) => (
        <div className="my-2">{post.content}</div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const posts = await fetchPosts();

  return {
    props: {
      posts,
    },
  };
}
