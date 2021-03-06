import * as React from "react";

import Footer from "~components/footer";
import KeybindsCheatsheet from "~components/keybinds-cheatsheet/lazy";
import MobileDrawer from "~components/mobile-drawer/lazy";
import MotionBox from "~components/motion/box";
import Navbar from "~components/navbar";
import siteConfig from "~config/site";
import { WebsiteSeoTagsQuery } from "~generated/graphql";
import useKeybinds from "~hooks/use-keybinds";
import useNProgress from "~hooks/use-nprogress";
import cms from "~lib/cms";
import emotionCache from "~lib/emotion-cache";
import { useCheatsheetSyncSetup } from "~store/global";
import { MetaContext } from "~store/meta";
import theme from "~theme";

import { ChakraProvider, EASINGS, Flex } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { AnimatePresence } from "framer-motion";
import NextApp, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import { OpenGraphImages } from "next-seo/lib/types";
import { renderMetaTags, SeoMetaTagType } from "react-datocms";

interface CustomAppProps extends AppProps {
  meta: WebsiteSeoTagsQuery;
}

const Providers: React.FC<Pick<CustomAppProps, "meta">> = (props) => {
  const { meta, children } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider resetCSS theme={theme}>
        <MetaContext.Provider value={meta}>
          {/*  */}
          {children}
        </MetaContext.Provider>
      </ChakraProvider>
    </CacheProvider>
  );
};

// https://github.com/chakra-ui/chakra-ui/blob/437302f73c475cdf66edb2f46715ddf8bf43e00e/packages/transition/src/slide-fade.tsx
const PAGE_TRANSITION_VARIANTS = {
  initial: {
    opacity: 0,
    x: 0,
    y: -8,
  },
  enter: {
    duration: 0.2,
    ease: EASINGS.easeOut,
    opacity: 1,
    x: 0,
    y: 0,
  },
  exit: {
    duration: 0.1,
    ease: EASINGS.easeIn,
    opacity: 0,
    x: 0,
    y: 8,
  },
};

const Effects: React.FC<Pick<CustomAppProps, "meta">> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { meta } = props;

  useCheatsheetSyncSetup();
  useKeybinds();
  useNProgress();

  return null;
};

export default function App(props: CustomAppProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component, pageProps, router, meta } = props;

  return (
    <Providers meta={meta}>
      <Head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        {renderMetaTags(meta.site.favicon as SeoMetaTagType[])}
      </Head>

      <DefaultSeo
        canonical={siteConfig.siteUrl + (router.asPath || "")}
        defaultTitle={meta.site.seo?.fallback?.title as string}
        description={meta.site.seo?.fallback?.description as string}
        openGraph={{
          type: "website",
          site_name: meta.site.seo?.siteName as string,
          images: [meta.site.seo?.fallback?.image as OpenGraphImages],
        }}
        twitter={{
          cardType: meta.site.seo?.fallback?.twitterCard as string,
          handle: meta.site.seo?.twitterAccount as string,
          site: meta.site.seo?.twitterAccount as string,
        }}
      />

      <SocialProfileJsonLd
        name={meta.site.seo?.siteName as string}
        sameAs={Object.values(
          meta.about?.socialsJson as Record<string, string>,
        )}
        type="person"
        url={siteConfig.siteUrl}
      />

      <Flex flexDir="column" minH="100vh">
        <Navbar />
        <AnimatePresence exitBeforeEnter>
          <MotionBox
            key={router.route}
            animate="enter"
            exit="exit"
            flexGrow={1}
            initial="initial"
            variants={PAGE_TRANSITION_VARIANTS}
          >
            <Component {...pageProps} />
          </MotionBox>
        </AnimatePresence>
        <Footer />
        <MobileDrawer />
        <KeybindsCheatsheet />
      </Flex>

      <Effects meta={meta} />
    </Providers>
  );
}

App.getInitialProps = async (ctx: AppContext) => {
  const props = NextApp.getInitialProps(ctx);
  const meta = await cms().websiteSeoTags();

  return { ...props, meta };
};
