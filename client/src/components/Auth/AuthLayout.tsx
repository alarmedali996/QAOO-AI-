import { ThemeSelector } from '@librechat/client';
import { TStartupConfig } from 'librechat-data-provider';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { hasPublishedPolicies } from '~/utils/policies';
import { TranslationKeys, useLocalize } from '~/hooks';
import SocialLoginRender from './SocialLoginRender';
import { BlinkAnimation } from './BlinkAnimation';
import LegalConsent from './LegalConsent';
import { Banner } from '../Banners';
import Footer from './Footer';
import { cn } from '~/utils';

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}) {
  const localize = useLocalize();

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const isRegister = pathname.includes('register');
  const isLogin = !pathname.includes('2fa') && pathname.includes('login');
  const showsSocialLogin = isLogin || isRegister;
  /** Both ways in state it, rather than the layout guessing which of them can
   *  create an account. That guess is not available here: account creation
   *  also happens on a first provider sign-in, on a first LDAP sign-in through
   *  the ordinary form, and is gated server-side by ALLOW_SOCIAL_REGISTRATION,
   *  which the startup payload does not carry. The sentence is about
   *  continuing, which is what both screens do, and it names the same policies
   *  the footer bar linked, so a screen states them once. */
  const hasPolicies = hasPublishedPolicies(startupConfig);
  /** Registration states it under its own submit button, where it is read
   *  before the account is created rather than below however many provider
   *  buttons a deployment configured, and it renders that form only once the
   *  config has loaded without error. The login screen has no submit button of
   *  its own to sit under, so there the layout states it below the providers,
   *  for as long as it knows the policies: a background refetch must not swap
   *  the sentence for the bar and back. */
  const registrationStatesConsent =
    isRegister && hasPolicies && !hasStartupConfigError && !isFetching;
  const statesConsentBelowProviders = isLogin && hasPolicies;
  /** The bar is dropped exactly when the sentence is on the screen, so a
   *  reader never meets both and never meets neither. */
  const statesConsent = registrationStatesConsent || statesConsentBelowProviders;
  const isTwoFactorSetup = pathname === '/login/2fa/setup';
  const DisplayError = () => {
    if (hasStartupConfigError) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize('com_auth_error_login_server')}</ErrorMessage>
        </div>
      );
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>
            {localize('com_auth_error_invalid_reset_token')}{' '}
            <a
              className="text-accent-primary font-semibold hover:underline"
              href="/forgot-password"
            >
              {localize('com_auth_click_here')}
            </a>{' '}
            {localize('com_auth_to_try_again')}
          </ErrorMessage>
        </div>
      );
    } else if (error != null && error) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize(error)}</ErrorMessage>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-500/10" />
      <Banner />
      <BlinkAnimation active={isFetching}>
        <div className="relative z-10 mx-auto mt-8 flex h-16 w-full max-w-[220px] items-center justify-center px-4">
          <img
            src="assets/logo.svg"
            className="h-full w-full object-contain drop-shadow-sm"
            alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'LibreChat' })}
          />
        </div>
      </BlinkAnimation>
      <DisplayError />
      <div className="absolute inset-s-0 bottom-0 md:m-4">
        <ThemeSelector />
      </div>

      <main className="relative z-10 flex grow items-center justify-center px-4 py-8">
        <div
          className={cn(
            'bg-surface-primary/95 w-full overflow-hidden rounded-3xl border border-border-light px-6 py-7 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:px-8 sm:py-8',
            isTwoFactorSetup ? 'max-w-lg' : 'max-w-md',
          )}
        >
          {!hasStartupConfigError && !isFetching && header && (
            <h1 className="text-text-primary mb-4 text-center text-3xl font-semibold select-none">
              {header}
            </h1>
          )}
          {children}
          {showsSocialLogin && (
            <SocialLoginRender startupConfig={startupConfig} showPasskey={isLogin} />
          )}
          {statesConsentBelowProviders && <LegalConsent startupConfig={startupConfig} />}
        </div>
      </main>
      {!statesConsent && <Footer startupConfig={startupConfig} />}
    </div>
  );
}

export default AuthLayout;
