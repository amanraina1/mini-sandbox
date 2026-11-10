import { BrowserRouter, Routes, Route } from "react-router-dom"
import SandboxList from "./pages/SandboxList"
import SandboxRepl from "./pages/SandboxRepl"

export default function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<SandboxList/>}></Route>
      <Route path="/sandbox/:id" element={<SandboxRepl/>}></Route>
    </Routes>
  </BrowserRouter>
}