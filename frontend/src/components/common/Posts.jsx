import React from "react";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/sampleSocialData";
import Post from "./Post";

const Posts = () => {
  const isLoading = false;

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && POSTS?.length === 0 && <p>No posts yet</p>}

      {!isLoading && POSTS?.length > 0 && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
