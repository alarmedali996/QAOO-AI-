import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Platform = 'Product page' | 'Instagram' | 'TikTok' | 'Facebook';
type Tone = 'Professional' | 'Friendly' | 'Luxury' | 'Persuasive';

const makeDraft = (name: string, features: string, audience: string, platform: Platform, tone: Tone) => {
  const cleanName = name.trim();
  const points = features.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean);
  const benefitLine = points.length ? points.slice(0, 4).join(' • ') : 'Designed to make your day easier';
  const customer = audience.trim() || 'people looking for quality and value';
  const openers: Record<Tone, string> = {
    Professional: `Discover ${cleanName} — a practical choice for ${customer}.`,
    Friendly: `Meet your new favorite: ${cleanName}! Made with ${customer} in mind.`,
    Luxury: `Introducing ${cleanName}, thoughtfully presented for ${customer}.`,
    Persuasive: `Ready for an upgrade? ${cleanName} brings together the features customers are looking for.`,
  };
  if (platform === 'Product page') {
    return `${cleanName}\n\n${openers[tone]}\n\nKey features: ${benefitLine}.\n\nChoose ${cleanName} today and see how it fits your needs. Please confirm all product details, availability and claims before publishing.`;
  }
  const hashtags = '#ShopNow #NewArrival #SmallBusiness';
  if (platform === 'TikTok') {
    return `${openers[tone]}\n\nHere is what to know: ${benefitLine}.\n\nWould you try it? Tell us below!\n\n${hashtags}`;
  }
  if (platform === 'Facebook') {
    return `${openers[tone]}\n\nWhy customers may love it: ${benefitLine}.\n\nSend us a message to learn more.\n\n${hashtags}`;
  }
  return `${openers[tone]}\n\n✨ Highlights: ${benefitLine}.\n\nSave this post and message us if you have questions.\n\n${hashtags}`;
};

export default function BusinessStudio() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [features, setFeatures] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<Platform>('Product page');
  const [tone, setTone] = useState<Tone>('Professional');
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const ready = name.trim().length > 1;
  const toolLabel = useMemo(() => platform === 'Product page' ? 'Product description' : `${platform} caption`, [platform]);

  const generate = () => {
    if (!ready) return;
    setDraft(makeDraft(name, features, audience, platform, tone));
    setCopied(false);
  };

  const copyDraft = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 overflow-y-auto p-4 pb-12 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-teal-700 dark:text-teal-300">QAOO-AI BUSINESS</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Marketing Studio</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">Create a first draft for your product page or social media. Review every detail before publishing.</p>
        </div>
        <button type="button" onClick={() => navigate('/c/new')} className="rounded-xl border border-border-medium px-4 py-2 text-sm font-medium hover:bg-surface-hover">Back to AI chat</button>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border-medium bg-surface-primary p-5">
          <h2 className="text-lg font-semibold">Create marketing content</h2>
          <p className="mt-1 text-sm text-text-secondary">Add accurate product information to prepare your draft.</p>
          <div className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium">Product or service name
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Example: Wireless headphones" className="rounded-xl border border-border-medium bg-surface-secondary px-3 py-3 outline-none focus:border-teal-600" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">Features and benefits
              <textarea value={features} onChange={(e) => setFeatures(e.target.value)} maxLength={1000} rows={4} placeholder="Comfortable fit, long battery life, lightweight..." className="resize-y rounded-xl border border-border-medium bg-surface-secondary px-3 py-3 outline-none focus:border-teal-600" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">Target customers (optional)
              <input value={audience} onChange={(e) => setAudience(e.target.value)} maxLength={120} placeholder="Example: students and remote workers" className="rounded-xl border border-border-medium bg-surface-secondary px-3 py-3 outline-none focus:border-teal-600" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium">Content type
                <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} className="rounded-xl border border-border-medium bg-surface-secondary px-3 py-3">
                  <option>Product page</option><option>Instagram</option><option>TikTok</option><option>Facebook</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">Writing tone
                <select value={tone} onChange={(e) => setTone(e.target.value as Tone)} className="rounded-xl border border-border-medium bg-surface-secondary px-3 py-3">
                  <option>Professional</option><option>Friendly</option><option>Luxury</option><option>Persuasive</option>
                </select>
              </label>
            </div>
            <button type="button" disabled={!ready} onClick={generate} className="rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">Generate {toolLabel}</button>
          </div>
        </div>

        <div className="rounded-2xl border border-border-medium bg-surface-primary p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Your draft</h2>
            {draft && <button type="button" onClick={copyDraft} className="rounded-lg border border-border-medium px-3 py-2 text-sm hover:bg-surface-hover">{copied ? 'Copied' : 'Copy text'}</button>}
          </div>
          {draft ? (
            <pre className="mt-4 min-h-64 whitespace-pre-wrap break-words rounded-xl bg-surface-secondary p-4 font-sans text-sm leading-7">{draft}</pre>
          ) : (
            <div className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border-medium bg-surface-secondary p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700/10 text-2xl text-teal-700">✦</div>
              <p className="font-medium">Your marketing draft will appear here</p>
              <p className="mt-2 max-w-xs text-sm text-text-secondary">Enter a product name and choose Generate to create a starter draft.</p>
            </div>
          )}
          <p className="mt-4 text-xs leading-5 text-text-secondary">Starter version: drafts are assembled from your inputs using local templates. AI-powered generation, saved projects and paid plans are not enabled yet. Always verify claims, prices and product details.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-teal-700/20 bg-teal-700/5 p-5">
        <h2 className="font-semibold">Next tools planned</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {['Ad copy generator', 'Product SEO helper', 'Campaign idea planner'].map((item) => <div key={item} className="rounded-xl border border-border-medium bg-surface-primary p-3 text-sm font-medium">{item}<p className="mt-1 text-xs font-normal text-text-secondary">Planned — not available yet</p></div>)}
        </div>
      </section>
    </main>
  );
}
