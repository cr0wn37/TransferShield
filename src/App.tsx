import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { RtoOfficerPage } from "./pages/RtoOfficerPage";
import { TransferWorkspacePage } from "./pages/TransferWorkspacePage";
import { DemoScenariosPage } from "./pages/DemoScenariosPage";
import { StartTransferPage } from "./pages/StartTransferPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartTransferPage />} />
        <Route path="/start" element={<StartTransferPage />} />
        <Route path="/transfer/:transferId" element={<TransferWorkspacePage />} />
        <Route path="/demo" element={<DemoScenariosPage />} />
        <Route path="/rto" element={<RtoOfficerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;