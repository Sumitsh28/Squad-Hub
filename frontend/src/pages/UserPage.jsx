import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPosts from "../components/UserPosts";
import { useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);

  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      <UserPosts
        likes={123}
        replies={3}
        postImg={"/trip.jpg"}
        postTitle={"My first Trip"}
      />
      <UserPosts
        likes={123}
        replies={3}
        postImg={"/trip.jpg"}
        postTitle={"My first Trip"}
      />
      <UserPosts
        likes={123}
        replies={3}
        postImg={"/trip.jpg"}
        postTitle={"My first Trip"}
      />
    </>
  );
};

export default UserPage;