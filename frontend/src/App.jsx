import { Container, Box, Menu, Flex, GridItem, Grid } from "@chakra-ui/react";
import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/UserAtoms";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ChatPage from "./pages/ChatPage";
import MyComponent from "./components/Menu";
import Blitz from "./pages/Blitz";
import { SettingsPage } from "./pages/SettingsPage";
import PremiumPage from "./pages/PremiumPage";
import PremiumPayment from "./pages/PremiumPayment";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import NotificationPage from "./pages/NotificationPage";
import BookmarksPage from "./pages/BookmarksPage";
import Live from "./pages/Live";
import SuggestedUsers from "./components/SuggestedUsers";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} maxW="1200px" m="auto">
        <GridItem colSpan={1}>{user && <MyComponent />}</GridItem>
        <GridItem colSpan={1}>
          <Box w="600px">
            <Container
              maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
            >
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={user ? <HomePage /> : <Navigate to="/auth" />}
                />
                <Route
                  path="/auth"
                  element={!user ? <AuthPage /> : <Navigate to="/" />}
                />
                <Route
                  path="/update"
                  element={
                    user ? <UpdateProfilePage /> : <Navigate to="/auth" />
                  }
                />
                <Route
                  path="/:username"
                  element={
                    user ? (
                      <>
                        <UserPage />
                      </>
                    ) : (
                      <UserPage />
                    )
                  }
                />
                <Route path="/:username/post/:pid" element={<PostPage />} />
                <Route
                  path="/chat"
                  element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
                />

                <Route
                  path="/live"
                  element={user ? <Live /> : <Navigate to={"/auth"} />}
                />

                <Route
                  path="/blitz"
                  element={user ? <Blitz /> : <Navigate to="/auth" />}
                />

                <Route
                  path="/settings"
                  element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
                />

                <Route
                  path="/premium"
                  element={user ? <PremiumPage /> : <Navigate to={"/auth"} />}
                />

                <Route
                  path="/premium/payment"
                  element={
                    user ? <PremiumPayment /> : <Navigate to={"/auth"} />
                  }
                />

                <Route
                  path="/premium/payment/confirm"
                  element={
                    user ? <PaymentConfirmation /> : <Navigate to={"/auth"} />
                  }
                />

                <Route
                  path="/notifications"
                  element={
                    user ? <NotificationPage /> : <Navigate to={"/auth"} />
                  }
                />

                <Route
                  path="/bookmarks"
                  element={user ? <BookmarksPage /> : <Navigate to={"/auth"} />}
                />
              </Routes>
            </Container>
          </Box>
        </GridItem>

        {pathname !== "/premium" &&
          pathname !== "/chat" &&
          pathname !== "/auth" && (
            <GridItem colSpan={1}>
              <Box
                flex={30}
                display={{
                  base: "none",
                  md: "block",
                }}
                mt={40}
                position={"fixed"}
                ml={10}
              >
                <SuggestedUsers />
              </Box>
            </GridItem>
          )}
      </Grid>
    </>
  );
}

export default App;
