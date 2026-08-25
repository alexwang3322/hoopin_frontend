import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppStoreProvider } from "./context/AppStoreContext";
import { ToastProvider } from "./context/ToastContext";
import { RootLayout } from "./components/Layout/RootLayout";
import { DiscoverPage } from "./pages/Discover/DiscoverPage";
import { EventDetailPage } from "./pages/EventDetail/EventDetailPage";
import { CreateRunPage } from "./pages/CreateRun/CreateRunPage";
import { HostingPage } from "./pages/Hosting/HostingPage";
import { MyRunsPage } from "./pages/MyRuns/MyRunsPage";
import { AccountPage } from "./pages/Account/AccountPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { DisclaimerPage } from "./pages/Disclaimer/DisclaimerPage";

function App() {
  return (
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
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppStoreProvider>
  );
}

export default App;
