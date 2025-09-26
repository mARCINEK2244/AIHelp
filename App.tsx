import React from 'react';
import SubstanceSelector from './components/SubstanceSelector';
import Dashboard from './components/Dashboard';
import AlarmModal from './components/AlarmModal';
import UserInfoForm from './components/UserInfoForm';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';
import type { CravingLog, Substance, UserInfo, CravingDetails, AIResponse, FeedbackMemory, AnonymousFeedbackData } from './types';
import { getCopingStrategies } from './services/geminiService';
import { shareAnonymousFeedback, getAnonymousId } from './services/analyticsService';

const defaultFeedbackMemory: FeedbackMemory = {
  strategy_effectiveness: {},
  trigger_map: {},
  time_heatmap: {},
  rolling: {
    craving_3d_avg: 0,
    craving_7d_avg: 0,
    slope_3d: 0,
    evening_peak_ratio: 0,
  },
  last_updated: new Date().toISOString(),
};


const App: React.FC = () => {
  const { 
    currentUser, 
    userAppData, 
    login, 
    signup, 
    logout, 
    updateUserAppData, 
    isLoading,
    resetUserProgress 
  } = useAuth();
  
  const [isAlarmActive, setIsAlarmActive] = React.useState(false);
  const [aiResponse, setAiResponse] = React.useState<AIResponse | null>(null);
  const [isLoadingStrategies, setIsLoadingStrategies] = React.useState(false);
  const [currentAlarmDetails, setCurrentAlarmDetails] = React.useState<CravingDetails | null>(null);
  const [currentAlarmTriggers, setCurrentAlarmTriggers] = React.useState<string[] | null>(null);
  const [isChangingSubstance, setIsChangingSubstance] = React.useState(false);

  const selectedSubstance = userAppData?.selectedSubstance;
  const userInfo = userAppData?.userInfo;
  const cravingLogs = userAppData?.cravingLogs || [];

  const handleSubstanceSelect = (newSubstance: Substance) => {
    const isCancellingChange = isChangingSubstance && newSubstance.id === selectedSubstance?.id;

    if (!isCancellingChange) {
      // Reset progress for a new substance or for the very first selection
      updateUserAppData({ selectedSubstance: newSubstance, userInfo: null, cravingLogs: [] });
    }
    
    setIsChangingSubstance(false);
  };
  
  const handleUserInfoSubmit = (info: UserInfo) => {
    updateUserAppData({ userInfo: info, feedbackMemory: defaultFeedbackMemory });
  };

  const handleGoBack = () => {
    setIsChangingSubstance(true);
  };
  
  const handleFullReset = () => {
     if (window.confirm("Czy na pewno chcesz usunąć wszystkie swoje postępy z tego konta? Ta akcja jest nieodwracalna.")) {
       resetUserProgress();
    }
  }

  const triggerAlarm = React.useCallback(async (data: { symptoms: CravingDetails, triggers: string[] }) => {
    if (!selectedSubstance || !userInfo || !userAppData) return;
    
    const { symptoms, triggers } = data;
    const totalIntensity = Object.values(symptoms).reduce((sum, value) => sum + value, 0);
    if (totalIntensity === 0) return;

    setCurrentAlarmDetails(symptoms);
    setCurrentAlarmTriggers(triggers);
    const newLog: CravingLog = { timestamp: new Date().toISOString(), details: symptoms, triggers, totalIntensity };
    
    const updatedLogs = [...cravingLogs, newLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    updateUserAppData({ cravingLogs: updatedLogs });
    
    setIsAlarmActive(true);
    setIsLoadingStrategies(true);
    setAiResponse(null);

    try {
      const response = await getCopingStrategies(
          selectedSubstance, 
          userInfo, 
          updatedLogs, 
          symptoms,
          triggers,
          userAppData.feedbackMemory || defaultFeedbackMemory
      );
      setAiResponse(response);
    } catch (error) {
      console.error("Error fetching coping strategies:", error);
      // The service should return a fallback crisis response on its own.
    } finally {
      setIsLoadingStrategies(false);
    }
  }, [selectedSubstance, userInfo, userAppData, updateUserAppData, cravingLogs]);

  const closeAlarm = () => {
    setIsAlarmActive(false);
    setCurrentAlarmDetails(null);
    setCurrentAlarmTriggers(null);
  };
  
  const handleFollowupSubmit = (answers: { [key: string]: string | string[] }) => {
    if (userAppData?.userInfo?.allowAnonymousCollection && currentAlarmDetails && selectedSubstance) {
      const totalIntensity = Object.values(currentAlarmDetails).reduce((sum, value) => sum + value, 0);

      const feedbackData: AnonymousFeedbackData = {
        anonymousUserId: getAnonymousId(),
        timestamp: new Date().toISOString(),
        problem: {
          substanceId: selectedSubstance.id,
          cravingDetails: currentAlarmDetails,
          cravingTriggers: currentAlarmTriggers || [],
          cravingTotalIntensity: totalIntensity,
        },
        solution: aiResponse,
        feedback: {
          followupAnswers: answers,
        },
      };

      shareAnonymousFeedback(feedbackData);
    }
    setCurrentAlarmDetails(null);
    setCurrentAlarmTriggers(null);
    console.log("Follow-up answers captured for potential local update:", answers);
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!currentUser) {
      return <Auth onLogin={login} onSignup={signup} />;
    }

    if (!selectedSubstance || isChangingSubstance) {
      return <SubstanceSelector onSelect={handleSubstanceSelect} />;
    }
    
    if (!userInfo) {
      return <UserInfoForm onSubmit={handleUserInfoSubmit} onBack={handleGoBack} />;
    }

    return (
      <Dashboard
        substance={selectedSubstance}
        userInfo={userInfo}
        cravingLogs={cravingLogs}
        feedbackMemory={userAppData?.feedbackMemory}
        onTriggerAlarm={triggerAlarm}
        onGoBack={handleGoBack}
        onReset={handleFullReset}
        onLogout={logout}
      />
    );
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans flex flex-col items-center p-4 selection:bg-teal-400/30">
      <div className="w-full max-w-4xl mx-auto">
        {renderContent()}
        {isAlarmActive && (
          <AlarmModal
            isOpen={isAlarmActive}
            onClose={closeAlarm}
            aiResponse={aiResponse}
            isLoading={isLoadingStrategies}
            onFollowupSubmit={handleFollowupSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default App;