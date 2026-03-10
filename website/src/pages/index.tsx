import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '1.5rem'}}>
          iOS AVPlayer + Android ExoPlayer. Ads, analytics, content protection. TypeScript-first.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/api/components"
            style={{marginLeft: '1rem'}}>
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'True Native Playback',
    description: 'Uses AVPlayer on iOS and ExoPlayer on Android — no WebView. Get the best performance and full platform integration.',
  },
  {
    title: 'Full Ad Support',
    description: 'VAST, VPAID, Google IMA, pre/mid/post-roll — all configured through your BB playout. Track every ad lifecycle event.',
  },
  {
    title: 'Expo & Bare RN',
    description: 'Works with both Expo (SDK 51+) and bare React Native (0.73+). Config plugin handles native setup automatically.',
  },
  {
    title: 'TypeScript-First',
    description: 'Comprehensive types for every component, method, event, and data model. Full IntelliSense support out of the box.',
  },
  {
    title: 'Old & New Architecture',
    description: 'Supports both Old Architecture (NativeModules) and New Architecture (TurboModules/Fabric) with automatic detection.',
  },
  {
    title: 'Shorts & Outstream',
    description: 'Vertical video player with swipe navigation (TikTok-style) and standalone outstream ad player with collapse/expand.',
  },
];

function Features() {
  return (
    <section style={{padding: '3rem 0'}}>
      <div className="container">
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className="col col--4" style={{marginBottom: '1.5rem'}}>
              <div className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  const code = `import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

export function MyPlayer() {
  return (
    <BBPlayerView
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      options={{ autoPlay: true }}
      style={{ flex: 1 }}
      onDidTriggerPlay={() => console.log('Playing')}
    />
  );
}`;

  return (
    <section style={{padding: '3rem 0', background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="row">
          <div className="col col--5">
            <Heading as="h2">Quick Start</Heading>
            <p>Install the package, add a single component, and you have a fully-featured video player.</p>
            <div style={{marginTop: '1rem'}}>
              <CodeBlock language="bash">
                npm install @bluebillywig/react-native-bb-player
              </CodeBlock>
            </div>
            <p style={{marginTop: '1rem'}}>
              <Link to="/docs/getting-started">Full installation guide →</Link>
            </p>
          </div>
          <div className="col col--7">
            <CodeBlock language="tsx" title="App.tsx">
              {code}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function Compatibility() {
  return (
    <section style={{padding: '3rem 0'}}>
      <div className="container" style={{textAlign: 'center'}}>
        <Heading as="h2">Works Everywhere</Heading>
        <p style={{maxWidth: 600, margin: '0 auto 2rem'}}>
          Supports the full React Native ecosystem — bare projects, Expo, old and new architecture.
        </p>
        <div className="row" style={{justifyContent: 'center'}}>
          {[
            ['iOS 13.4+', 'AVPlayer'],
            ['Android API 24+', 'ExoPlayer'],
            ['React Native 0.73+', 'Old & New Arch'],
            ['Expo SDK 51+', 'Config Plugin'],
          ].map(([platform, detail], idx) => (
            <div key={idx} className="col col--3" style={{marginBottom: '1rem'}}>
              <strong>{platform}</strong>
              <br />
              <span style={{color: 'var(--ifm-color-emphasis-600)', fontSize: '0.9rem'}}>{detail}</span>
            </div>
          ))}
        </div>
        <p style={{marginTop: '2rem'}}>
          <Link to="/docs/feature-matrix">Full feature matrix →</Link>
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Native Video Player for React Native"
      description="Blue Billywig Native Video Player SDK for React Native — iOS AVPlayer and Android ExoPlayer with ads, analytics, and TypeScript support.">
      <HomepageHeader />
      <main>
        <Features />
        <QuickStart />
        <Compatibility />
      </main>
    </Layout>
  );
}
