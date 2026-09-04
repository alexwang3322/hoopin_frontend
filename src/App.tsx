import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { AppStoreProvider } from "./context/AppStoreContext";
import { ToastProvider } from "./context/ToastContext";
import { RootLayout } from "./components/Layout/RootLayout";
import { setClerkGetToken } from "./services/clerkBridge";
import { CLERK_PUBLISHABLE_KEY } from "./constants";
import { DiscoverPage } from "./pages/Discover/DiscoverPage";
import { EventDetailPage } from "./pages/EventDetail/EventDetailPage";
import { CreateRunPage } from "./pages/CreateRun/CreateRunPage";
import { HostingPage } from "./pages/Hosting/HostingPage";
import { MyRunsPage } from "./pages/MyRuns/MyRunsPage";
import { AccountPage } from "./pages/Account/AccountPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { DisclaimerPage } from "./pages/Disclaimer/DisclaimerPage";
import { TermsPage } from "./pages/Terms/TermsPage";
import { PrivacyPage } from "./pages/Privacy/PrivacyPage";
import { SecurityPage } from "./pages/Security/SecurityPage";
import { DmcaPage } from "./pages/Dmca/DmcaPage";
import { AboutPage } from "./pages/About/AboutPage";

/** Hands apiClient.ts (a plain module) the current session's getToken() —
 *  see services/clerkBridge.ts. Renders nothing. */
function ClerkTokenBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkGetToken(getToken);
    return () => setClerkGetToken(null);
  }, [getToken]);

  return null;
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkTokenBridge />
      <AppStoreProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                <Route index element={<DiscoverPage />} />
                <Route path="runs/:runId" element={<EventDetailPage />} />
                <Route path="create" element={<CreateRunPage />} />
                <Route path="hosting" element={<HostingPage />} />
                <Route path="my-runs" element={<MyRunsPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="profile/:userId" element={<ProfilePage />} />
                <Route path="disclaimer" element={<DisclaimerPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="security" element={<SecurityPage />} />
                <Route path="dmca" element={<DmcaPage />} />
                <Route path="about" element={<AboutPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AppStoreProvider>
    </ClerkProvider>
  );
}

export default App;
