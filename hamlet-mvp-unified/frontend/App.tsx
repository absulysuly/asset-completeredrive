import React, { useState, useEffect, Suspense, lazy } from 'react';
import { User, Governorate, Language, AppTab, Post } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomBar from './components/BottomBar';
import LoginModal from './components/LoginModal';
import LanguageSwitcher from './components/LanguageSwitcher';
import PostDetailModal from './components/PostDetailModal';
import Spinner from './components/Spinner';

const HomeView = lazy(() => import('./components/views/HomeView'));
const UserProfileView = lazy(() => import('./components/views/UserProfileView'));
const CompassView = lazy(() => import('./compass/CompassView'));


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Home);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [language, setLanguage] = useState<Language>('ar');

    // Filters
    const [selectedGovernorate, setSelectedGovernorate] = useState<Governorate | 'All'>('All');

    // View-specific state
    const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null);


    // --- EFFECTS ---
    useEffect(() => {
        const isRtl = language === 'ar' || language === 'ku';
        document.documentElement.lang = language;
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    }, [language]);
    
    // --- HANDLERS ---
    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setLoginModalOpen(false);
        setActiveTab(AppTab.Home);
    };

    const handleUpdateUser = (updatedUser: User) => {
        setUser(updatedUser);
    }

    const handleNavigate = (tab: AppTab) => {
        if (tab === AppTab.UserProfile && !user) {
            setLoginModalOpen(true);
            return;
        }
        setActiveTab(tab);
    };

    const handleSelectPost = (post: Post) => {
        setSelectedPostForDetail(post);
    };

    const handleClosePostDetail = () => {
        setSelectedPostForDetail(null);
    };

    const renderContent = () => {
        const homeViewProps = {
            user: user,
            requestLogin: () => setLoginModalOpen(true),
            selectedGovernorate: selectedGovernorate,
            onGovernorateChange: setSelectedGovernorate,
            language: language,
            onSelectPost: handleSelectPost,
        };

        switch (activeTab) {
            case AppTab.Home:
                return <HomeView {...homeViewProps} />;
            case AppTab.Compass:
                return <CompassView />;
            case AppTab.UserProfile:
                return user ? (
                    <UserProfileView
                        user={user}
                        onUpdateUser={handleUpdateUser}
                        language={language}
                        onSelectProfile={() => setActiveTab(AppTab.UserProfile)}
                        onSelectPost={handleSelectPost}
                    />
                ) : (
                    <HomeView {...homeViewProps} />
                );
            default:
                return <HomeView {...homeViewProps} />;
        }
    }
    
    return (
        <div className="min-h-screen font-sans">
            <Header 
                user={user} 
                onRequestLogin={() => setLoginModalOpen(true)}
                onNavigate={handleNavigate}
                language={language}
            />
            
            <Sidebar 
                user={user} 
                activeTab={activeTab} 
                onNavigate={handleNavigate}
                language={language}
            />
            
            <main className="lg:pl-64 pt-14 pb-16 lg:pb-0">
                <div className="px-4 sm:px-6 py-4 flex flex-col items-center gap-4">
                    <LanguageSwitcher
                        language={language}
                        onLanguageChange={setLanguage}
                    />
                </div>

                <Suspense fallback={<div className="flex justify-center items-center p-10"><Spinner /></div>}>
                    {renderContent()}
                </Suspense>
            </main>
            
            <BottomBar
                user={user}
                activeTab={activeTab}
                onNavigate={handleNavigate}
                language={language}
            />

            {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setLoginModalOpen(false)} language={language} onLanguageChange={setLanguage} />}
            {selectedPostForDetail && <PostDetailModal post={selectedPostForDetail} user={user} onClose={handleClosePostDetail} requestLogin={() => setLoginModalOpen(true)} language={language} />}
        </div>
    );
};

export default App;