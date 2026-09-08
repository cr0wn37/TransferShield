import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { RtoOfficerPage } from "./pages/RtoOfficerPage";
import { TransferWorkspacePage } from "./pages/TransferWorkspacePage";
import { TransferTimelinePage } from "./pages/TransferTimelinePage";
import { DemoScenariosPage } from "./pages/DemoScenariosPage";
import { StartTransferPage } from "./pages/StartTransferPage";
import { HowItWorksPage } from "./pages/AboutTransferShieldPage";
import { RtoOfficerConsolePage } from "./pages/RtoOfficerConsolePage";
import { TransferSlaPage } from "./pages/TransferSlaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartTransferPage />} />
        <Route path="/start" element={<StartTransferPage />} />

        <Route path="/transfer/:transferId" element={<TransferWorkspacePage />} />

        <Route path="/transfer/:transferId/timeline" element={<TransferTimelinePage />} />

        <Route path="/transfer/:transferId/sla" element={<TransferSlaPage />} />

        <Route path="/about" element={<HowItWorksPage />} />
        <Route path="/demo" element={<DemoScenariosPage />} />

        <Route path="/rto" element={<RtoOfficerConsolePage />} />
        <Route path="/rto/:transferId" element={<RtoOfficerPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;