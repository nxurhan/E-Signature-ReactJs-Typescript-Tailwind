import Login from "./pages/Login"
import Layout from "./components/layout/Layout"
import Dialog from "./components/layout/Dialog"
import { Provider as JotaiProvider } from "jotai"
import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import Signature from "./pages/Signature"

function App() {

  return (
    <JotaiProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/Home/Login" />} />
          <Route path="/Home/Login" element={<Login />} />
          <Route path="/Home/ESignature" element={<Signature />} />
        </Routes>
        <Dialog />
      </Layout>
    </JotaiProvider>
  )
}

export default App