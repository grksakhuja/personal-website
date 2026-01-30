import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import JDAnalyzer from './sections/JDAnalyzer';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import ChatDrawer from './components/ChatDrawer';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-[--color-background]">
        <Navbar />
        <main>
          <Hero />
          <JDAnalyzer />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <ChatDrawer />
      </div>
    </ChatProvider>
  );
}

export default App;
