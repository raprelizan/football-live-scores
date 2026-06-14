import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import MatchDetail from "./pages/MatchDetail";
import Competitions from "./pages/Competitions";
import Standings from "./pages/Standings";
import Scorers from "./pages/Scorers";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/match/:id"} component={MatchDetail} />
      <Route path={"/competitions"} component={Competitions} />
      <Route path={"/standings"} component={Standings} />
      <Route path={"/scorers"} component={Scorers} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
