import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import OnboardingWizard, { OnboardData } from './components/OnboardingWizard';
import HomePage from './components/HomePage';

type AppScreen = 'landing' | 'onboarding' | 'home';

const SCREEN_PATHS: Record<AppScreen, string> = {
  landing: '/',
  onboarding: '/onboarding',
  home: '/home',
};

const PATH_SCREENS: Record<string, AppScreen> = {
  '/': 'landing',
  '/onboarding': 'onboarding',
  '/home': 'home',
};

function getInitialScreen(): AppScreen {
  return PATH_SCREENS[window.location.pathname] ?? 'landing';
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(getInitialScreen);
  const [selectedPhase, setSelectedPhase] = useState<string>('growth');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Push a real history entry whenever screen changes
  const navigate = (screen: AppScreen) => {
    const path = SCREEN_PATHS[screen];
    if (window.location.pathname !== path) {
      window.history.pushState({ screen }, '', path);
    }
    setCurrentScreen(screen);
  };

  // Handle browser back/forward
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const screen = PATH_SCREENS[window.location.pathname] ?? 'landing';
      setCurrentScreen(screen);
    };
    window.addEventListener('popstate', onPop);
    // Seed the initial history entry so back works from the first screen
    window.history.replaceState({ screen: currentScreen }, '', SCREEN_PATHS[currentScreen]);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleOnboardComplete = (data: OnboardData) => {
    setSelectedPhase(data.phase);
    setSelectedLanguage(data.language);
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {currentScreen === 'landing' && (
        <LandingPage
          onGetStarted={() => navigate('onboarding')}
          onLogin={() => navigate('onboarding')}
        />
      )}
      {currentScreen === 'onboarding' && (
        <OnboardingWizard
          onComplete={handleOnboardComplete}
          onSkip={() => navigate('home')}
          onBack={() => navigate('landing')}
        />
      )}
      {currentScreen === 'home' && (
        <HomePage
          selectedPhase={selectedPhase}
          selectedLanguage={selectedLanguage}
          onPhaseChange={setSelectedPhase}
          onLanguageChange={setSelectedLanguage}
          onLogoClick={() => navigate('landing')}
          onAddCrop={() => navigate('onboarding')}
          onLogout={() => navigate('landing')}
        />
      )}
    </div>
  );
}
