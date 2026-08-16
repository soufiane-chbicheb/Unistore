import React from 'react';
import Layout from '../../Layouts/Layout';
import { router } from '@inertiajs/react';
import HeroSlider from './Partials/HeroSlider';
import PromoBanners from './Partials/PromoBanners';
import FeatureStrip from './Partials/FeatureStrip';
import NewsletterSection from './Partials/NewsletterSection';
import PromoStrip from './Partials/PromoStrip';
import CategoryBanners from './Partials/CategoryBanners';
import { ScrollRow } from './Partials/ScrollRow';
import {
  FeedItem,
  VideoSplitBlock,
  FullVideoBlock,
  CountdownDealBlock,
  UGCWallBlock,
  BrandSpotlightBlock,
  QuizCTABlock,
  SocialProofBlock,
  LookbookGridBlock,
  AdSlotBlock,

} from '@/types/HomeFeedTypes';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import BannerRenderer from '../admin/pages/store/Banner/Partials/BannerRenderer';


// ─────────────────────────────────────────────────────────────────────────────
//  renderBlock  — the single switch that maps type → component
// ─────────────────────────────────────────────────────────────────────────────
const renderBlock = (item: FeedItem, onViewAll: (key: string) => void) => {
  switch (item.type) {
    case 'collection': return <ScrollRow key={item.data.key} section={item.data} onViewAll={onViewAll} />;
    case 'banner': return <BannerRenderer isEditor={false} key={item.data.id} banner={item.data} />;
    // case 'video_split':     return <VideoSplitRenderer    key={item.data.id} data={item.data} />;
    // case 'countdown_deal':  return <CountdownDealRenderer key={item.data.id} data={item.data} />;
    // case 'ugc_wall':        return <UGCWallRenderer       key={item.data.id} data={item.data} />;
    // case 'brand_spotlight': return <BrandSpotlightRenderer key={item.data.id} data={item.data} />;
    // case 'quiz_cta':        return <QuizCTARenderer       key={item.data.id} data={item.data} />;
    // case 'social_proof':    return <SocialProofRenderer   key={item.data.id} data={item.data} />;
    // case 'lookbook_grid':   return <LookbookGridRenderer  key={item.data.id} data={item.data} />;
    // case 'ad_slot':         return <AdSlotRenderer        key={item.data.id} data={item.data} />;
    case 'full_video': return null;
    default: return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
interface HomePageProps {
  /** Feed from backend — if omitted, uses FAKE_FEED */
  feed?: FeedItem[];
  heroSlider?: any; // Dynamic slider data from backend
  onViewAll?: (sectionKey: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ feed = [], heroSlider, onViewAll }) => {
  const handleViewAll = (key: string) => {
    if (key === 'collections.new_arrivals') {
      router.get('/marketplace', { source: 'new_arrivals' });
    } else if (key.startsWith('collections.')) {
      const categorySlug = key.split('.')[1];
      router.get('/marketplace', { category: categorySlug });
    } else {
      router.get('/marketplace');
    }
  };

  return (
    <Layout currentPage="home">
      {/* ── Fixed Hero Slider — always at the top ── */}
      <HeroSlider slider={heroSlider} />

      {/* ── Dynamic feed — backend controls everything below ── */}
      <section style={{ paddingBlock: '3rem' }}>
        {feed.map(item => renderBlock(item, handleViewAll))}
      </section>

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </Layout>
  );
};

export default HomePage;
