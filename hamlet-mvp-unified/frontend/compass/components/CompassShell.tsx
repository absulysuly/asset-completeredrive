import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { StoriesRing } from './StoriesRing';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedBusinesses } from './FeaturedBusinesses';
import { PersonalizedEvents } from './PersonalizedEvents';
import { DealsMarketplace } from './DealsMarketplace';
import { CommunityStories } from './CommunityStories';
import { CityGuide } from './CityGuide';
import { BusinessDirectory } from './BusinessDirectory';
import { InclusiveFeatures } from './InclusiveFeatures';
import { AuthModal } from './AuthModal';
import { Dashboard } from './Dashboard';
import { SubcategoryModal } from './SubcategoryModal';
import { GovernorateFilter } from './GovernorateFilter';
import { SearchPortal } from './SearchPortal';
import { mockUser } from '../constants';
import type { User, Category, Subcategory } from '../types';
import { TranslationProvider, useTranslations } from '../hooks/useTranslations';

const CompassShellInner: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [page, setPage] = useState<'home' | 'dashboard' | 'listing'>('home');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [listingFilter, setListingFilter] = useState<{ categoryId: string } | null>(null);
    const [selectedGovernorate, setSelectedGovernorate] = useState('all');
    const [highContrast, setHighContrast] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('iraq-compass-high-contrast') === 'true';
        }
        return false;
    });
    const { dir } = useTranslations();

    useEffect(() => {
        console.log(`Governorate changed to: ${selectedGovernorate}. Data should be refetched.`);
    }, [selectedGovernorate]);

    useEffect(() => {
        if (highContrast) {
            document.documentElement.setAttribute('data-contrast', 'high');
            localStorage.setItem('iraq-compass-high-contrast', 'true');
        } else {
            document.documentElement.removeAttribute('data-contrast');
            localStorage.setItem('iraq-compass-high-contrast', 'false');
        }
    }, [highContrast]);

    const handleLogin = () => {
        setIsLoggedIn(true);
        setCurrentUser(mockUser);
        setShowAuthModal(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setPage('home');
    };

    const navigateTo = (targetPage: 'home' | 'dashboard') => {
        if (targetPage === 'dashboard' && !isLoggedIn) {
            setShowAuthModal(true);
        } else {
            setPage(targetPage);
            if (targetPage === 'home') {
                setListingFilter(null);
            }
        }
    };

    const handleCategoryClick = (category: Category) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setSelectedCategory(category);
        } else {
            setListingFilter({ categoryId: category.id });
            setPage('listing');
        }
    };

    const handleSubcategorySelect = (_category: Category, subcategory: Subcategory) => {
        setListingFilter({ categoryId: subcategory.parentCategoryId ?? _category.id });
        setPage('listing');
        setSelectedCategory(null);
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white" dir={dir}>
            <Header
                isLoggedIn={isLoggedIn}
                user={currentUser}
                onSignIn={() => setShowAuthModal(true)}
                onSignOut={handleLogout}
                onDashboard={() => navigateTo('dashboard')}
                onHome={() => navigateTo('home')}
            />
            <main>
                {page === 'home' && (
                    <>
                        <HeroSection />
                        <StoriesRing />
                        <SearchPortal />
                        <GovernorateFilter
                            selectedGovernorate={selectedGovernorate}
                            onGovernorateChange={setSelectedGovernorate}
                        />
                        <CategoryGrid
                            onCategoryClick={handleCategoryClick}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                        <FeaturedBusinesses />
                        <PersonalizedEvents />
                        <DealsMarketplace />
                        <CommunityStories />
                        <CityGuide />
                        <BusinessDirectory />
                        <InclusiveFeatures highContrast={highContrast} setHighContrast={setHighContrast} />
                    </>
                )}
                {page === 'listing' && listingFilter && (
                    <BusinessDirectory initialFilter={listingFilter} onBack={() => navigateTo('home')} />
                )}
                {page === 'dashboard' && currentUser && (
                    <Dashboard user={currentUser} onLogout={handleLogout} />
                )}
            </main>
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
            )}
            <SubcategoryModal
                category={selectedCategory}
                onClose={() => setSelectedCategory(null)}
                onSubcategorySelect={handleSubcategorySelect}
            />
        </div>
    );
};

export const CompassShell: React.FC = () => (
    <TranslationProvider>
        <CompassShellInner />
    </TranslationProvider>
);
