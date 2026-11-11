import { BrowserRouter, Routes, Route } from "react-router-dom"
import SandboxList from "./pages/SandboxList"
import SandboxRepl from "./pages/SandboxRepl"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1
    }
  }
})

export default function App() {

  return <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SandboxList/>}></Route>
        <Route path="/sandbox/:id" element={<SandboxRepl/>}></Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider> 
}