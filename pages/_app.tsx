import '../styles/globals.scss'
import 'normalize.css'

import { AppProps } from 'next/app'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import ConsoleWarning from '../components/ConsoleWarning'
import { darkModeAtom, globalSettings } from '../structs/setting'
import { useEffect } from 'react'
import Script from 'next/script'
import Head from 'next/head'

import '../structs/i18n'
import 'remixicon/fonts/remixicon.css'
import { SignInAskModalWrapper } from '../components/SignInAsk'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 }
}

const useDarkMode = () => {
  const darkMode = useRecoilValue(darkModeAtom)

  useEffect(() => {
    document.documentElement.dataset.darkMode = darkMode ? 'true' : 'false'
  }, [darkMode])
}

const useSettingSync = () => {
  const [settings, setSettings] = useRecoilState(globalSettings)

  useEffect(() => {
    const getSettings = async () => {
      const result = await fetch('/api/settings').then(v => v.json())

      if (result.status === 'success') {
        setSettings(result.data)
      }
    }

    getSettings()
  }, [setSettings])
}

const ContextUser = () => {
  useDarkMode()
  useSettingSync()

  return <></>
}

function MyApp ({
  Component,
  pageProps: { session, ...pageProps },
  router
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
        </Head>
        <Script
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "f924609c5236459d85d8d025c8abb7b3"}'
        ></Script>
        <ConsoleWarning></ConsoleWarning>
        <Header></Header>
        <Toaster
          position='top-center'
          toastOptions={{
            style: {
              borderRadius: '32px',
              padding: '12px 28px',
              boxShadow: 'unset',
              background: 'var(--color-primary-container, #fff)',
              color: 'var(--color-on-primary-container, #000)'
            },
            success: {
              iconTheme: {
                primary: 'var(--color-on-primary-container, green)',
                secondary: 'var(--color-primary-container, white)'
              }
            },
            error: {
              iconTheme: {
                primary: 'var(--color-error, red)',
                secondary: 'var(--color-on-error, white)'
              },
              style: {
                background: 'var(--color-error-container, #fff)',
                color: 'var(--color-on-error-container, #000)'
              }
            }
          }}
        ></Toaster>
        <ContextUser></ContextUser>
        <SignInAskModalWrapper></SignInAskModalWrapper>
        <motion.div
          key={router.route}
          variants={variants}
          className={'page-wrapper'}
          initial='hidden'
          animate='enter'
          exit='exit'
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
