import React, { useState, useEffect } from 'react';
import { User, Governorate, Language, Post } from '../../types.ts';
import { GOVERNORATES, GOVERNORATE_AR_MAP } from '../../constants.ts';
import { UI_TEXT } from '../../translations.ts';
import * as api from '../../services/apiService.ts';

import ComposeView from './ComposeView.tsx';
import PostCard from '../PostCard.tsx';
import SkeletonPostCard from '../SkeletonPostCard.tsx';

interface HomeViewProps {
    user: User | null;
    requestLogin: () => void;
    selectedGovernorate: Governorate | 'All';
    onGovernorateChange: (gov: Governorate | 'All') => void;
    language: Language;
    onSelectPost: (post: Post) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, requestLogin, selectedGovernorate, onGovernorateChange, language, onSelectPost }) => {
    const [socialPosts, setSocialPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const texts = UI_TEXT[language];

    useEffect(() => {
        const fetchFeedData = async () => {
            setIsLoadingPosts(true);
            try {
                const postsData = await api.getPosts({ governorate: selectedGovernorate });
                setSocialPosts(postsData);
            } catch (error) {
                console.error('Failed to fetch feed data:', error);
            } finally {
                setIsLoadingPosts(false);
            }
        };
        fetchFeedData();
    }, [selectedGovernorate]);

    const handlePost = (postDetails: Partial<Post>) => {
        if (!user) return;
        api.createPost(postDetails, user).then(newPost => {
            setSocialPosts(prevPosts => [newPost, ...prevPosts]);
        });
    };

    const FeedFilters = () => (
        <div className="flex flex-col gap-4 p-4 glass-card my-4 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center text-theme-text-base font-arabic">
                {texts.governorate}
            </h2>
            <div>
                <label htmlFor="gov-filter" className="block text-sm font-medium text-theme-text-muted font-arabic">{texts.governorate}</label>
                <select
                    id="gov-filter"
                    value={selectedGovernorate}
                    onChange={(e) => onGovernorateChange(e.target.value as Governorate | 'All')}
                    className="mt-1 block w-full p-2 border border-white/20 rounded-md bg-white/10 text-theme-text-base focus:outline-none focus:ring-1 focus:ring-primary font-arabic text-right"
                >
                    <option value="All">{texts.allIraq}</option>
                    {GOVERNORATES.map(gov => (
                        <option key={gov} value={gov}>{GOVERNORATE_AR_MAP[gov]}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    const renderPosts = () => {
        if (isLoadingPosts) {
            return [...Array(3)].map((_, i) => <SkeletonPostCard key={`skeleton-${i}`} />);
        }

        if (socialPosts.length === 0) {
            return <p className="text-center py-10 text-theme-text-muted">{texts.noPostsFound}</p>;
        }

        return socialPosts.map(post => (
            <PostCard
                key={post.id}
                post={post}
                user={user}
                requestLogin={requestLogin}
                language={language}
                onSelectPost={onSelectPost}
            />
        ));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-0 sm:p-6">
            <main className="lg:col-span-3">
                <div className="flex flex-col items-center">
                    <FeedFilters />
                </div>
                <div className="mt-4">
                    {user ? (
                        <ComposeView user={user} onPost={handlePost} language={language} postType="Post" />
                    ) : (
                        <div
                            onClick={requestLogin}
                            className="glass-card rounded-lg p-3 flex items-center space-x-4 cursor-pointer hover:border-primary"
                        >
                            <div className="flex-1 text-theme-text-muted font-arabic">{texts.whatsOnYourMind}</div>
                            <button className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-full">{texts.post}</button>
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    {renderPosts()}
                </div>
            </main>

            <aside className="hidden lg:block lg:col-span-1 space-y-6 pt-2">
                <div className="glass-card rounded-lg p-4">
                    <h3 className="font-bold mb-3 font-arabic">{texts.platformRules}</h3>
                    <ul className="text-sm space-y-2 list-disc list-inside text-theme-text-muted font-arabic">
                        <li>{texts.rule1}</li>
                        <li>{texts.rule2}</li>
                        <li>{texts.rule3}</li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default HomeView;
