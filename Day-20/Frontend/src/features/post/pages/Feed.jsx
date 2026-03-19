import React, { useEffect } from "react";
import "../style/Feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/usePost";
import Nav from "../../shared/components/Nav";
import FollowersCard from "../components/FollowersCard";

const Feed = () => {
  // console.log("hello");

  const {
    feed,
    handleGetFeed,
    loading,
    handleLike,
    handleUnlike,
    handleFollower,
    handleFollowing,
    follower,
    following,
  } = usePost();

  useEffect(() => {
    handleGetFeed();
    console.log("Post is going to be loaded");
    handleFollower();
    handleFollowing();
    // console.log("Follower From Feed", follower);
  }, []);

  if (loading) return <h1>Loading...</h1>;

  if (!feed || feed.length === 0) return <h1>No posts available</h1>;

  return (
    <main className="FeedPage">
      {/* <Nav></Nav> */}
      <div className="left-content-area">
        <div className="follower">
          <h1>Follower</h1>
          {follower.map((follow) => (
            <FollowersCard
              key={follow._id}
              username={follow.followee}
              status={follow.status}
            />
          ))}
        </div>
        <div className="style-following">
          <h1>Following</h1>
          {following.map((follow) => (
            <FollowersCard
              key={follow._id}
              username={follow.follower}
              status={follow.status}
            />
          ))}
        </div>
      </div>

      <div className="feed">
        <div className="posts">
          {feed.map((post) => {
            return (
              <Post
                key={post?._id ?? post?.id}
                user={post?.user}
                post={post}
                loading={loading}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Feed;
