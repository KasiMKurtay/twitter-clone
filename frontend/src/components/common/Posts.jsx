import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", feedType, username],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data ?? null;
      } catch (error) {
        throw new Error(error.message || "An unexpected error occurred");
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, username, refetch]);
  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {isError && (
        <div className="text-red-500 text-center">
          <p>Bir hata oluştu: {error.message}</p>
        </div>
      )}

      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">
          Bu sekmede hiç gönderi yok. Farklı bir sekme seçin 👻
        </p>
      )}

      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post?._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
