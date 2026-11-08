import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./index.css"
import { MusicProvider, StoreProvider } from "./components/AppState"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Problems from "./pages/Problems"
import DesmosTricks from "./pages/DesmosTricks"
import Challenge from "./pages/Challenge"
import Scan from "./pages/Scan"
import Toolkit from "./pages/Toolkit"
import ReadingWriting from "./pages/ReadingWriting"
import About from "./pages/About"
import Exam from "./pages/Exam"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <MusicProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="problems" element={<Problems />} />
              <Route path="problems/:id" element={<Problems />} />
              <Route path="desmos" element={<DesmosTricks />} />
              <Route path="desmos/:id" element={<DesmosTricks />} />
              <Route path="challenge" element={<Challenge />} />
              <Route path="exam" element={<Exam />} />
              <Route path="scan" element={<Scan />} />
              <Route path="toolkit" element={<Toolkit />} />
              <Route path="reading-writing" element={<ReadingWriting />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<About notFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MusicProvider>
    </StoreProvider>
  </StrictMode>,
)
