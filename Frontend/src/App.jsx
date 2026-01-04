import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./app/routes"
import Providers from "./app/providers"
import AICounselor from "./features/ai-counselor"

const App = () => {
  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
        <AICounselor />
      </Providers>
    </BrowserRouter>
  )
}

export default App
