"use client";
import Link from "next/link"
import { Facebook, Twitter } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation();
  
  // Debug: Check if CSS variables exist
  if (typeof window !== 'undefined') {
    console.log('CSS Vars:', {
      primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
      secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary'),
    });
  }
  
  return (
    <footer className="bg-gradient-to-r from-palette-primary to-palette-secondary text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center mb-8">
              <Image 
                src="/opticini-light.png" 
                alt="Opticini Logo" 
                width={300} 
                height={72}
                className="object-contain"
              />
            </div>
            <p className="text-white/80 max-w-xs leading-relaxed mt-4">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-h4-dynamic">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/request-demo" className="text-white/80 hover:text-white transition-colors">
                  Request Demo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="text-white/80 hover:text-white transition-colors">
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section 1 */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Discovery</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/discovery" className="text-white/80 hover:text-white transition-colors">
                    Know everything that exists
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Health</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/health" className="text-white/80 hover:text-white transition-colors">
                    Know what's up—and what's not
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Performance</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/performance" className="text-white/80 hover:text-white transition-colors">
                    Understand how systems behave
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Security</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/security" className="text-white/80 hover:text-white transition-colors">
                    Reduce exposure and attack surface
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Configuration</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/configuration" className="text-white/80 hover:text-white transition-colors">
                    Prevent drift and misconfiguration
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section 2 */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Compliance</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/compliance" className="text-white/80 hover:text-white transition-colors">
                    Stay continuously audit-ready
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Evidence</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/evidence" className="text-white/80 hover:text-white transition-colors">
                    Prove compliance—automatically
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Change</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/change" className="text-white/80 hover:text-white transition-colors">
                    Know what changed—and why it matters
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Cost</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/cost" className="text-white/80 hover:text-white transition-colors">
                    Understand spend and waste
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-h4-dynamic">Risk</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features/risk" className="text-white/80 hover:text-white transition-colors">
                    Prioritize what truly matters
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <h3 className="font-semibold text-white text-h4-dynamic">{t('footer.connect')}</h3>
              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/pagerodeo" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://www.x.com/pagerodeo" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-white/80 hover:text-white transition-colors font-medium">
                {t('footer.about')}
              </Link>
              <Link href="/affiliate" className="text-white/80 hover:text-white transition-colors font-medium">
                Affiliates
              </Link>
              <Link href="/marketing" className="text-white/80 hover:text-white transition-colors font-medium">
                Deals
              </Link>
              <Link href="/feedback" className="text-white/80 hover:text-white transition-colors font-medium">
                {t('footer.feedback')}
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors font-medium">
                {t('footer.contact')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/80">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 text-sm text-white/80">
            <Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">{t('footer.cookiePolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
