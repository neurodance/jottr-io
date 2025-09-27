import { Link } from 'react-router-dom'
import {
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  PencilSquareIcon,
  ShareIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-indigo-600">jottr</span>
              <span className="text-sm text-gray-500">.io</span>
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
              Features
            </a>
            <a href="#creators" className="text-sm font-semibold leading-6 text-gray-900">
              For Creators
            </a>
            <a href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">
              Pricing
            </a>
            <Link to="/explore" className="text-sm font-semibold leading-6 text-gray-900">
              Explore
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Start Creating
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Join 10,000+ creators earning from their Jotts.{' '}
                <Link to="/signup" className="font-semibold text-indigo-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Start free <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Share your knowledge,
              <br />
              <span className="text-indigo-600">visually</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create beautiful, interactive visual content that your audience will love.
              Build your subscriber base and monetize your expertise with Jotts.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Start creating for free
              </Link>
              <Link to="/explore" className="text-sm font-semibold leading-6 text-gray-900">
                Browse Jotts <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Gradient background */}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Create, Share, and Monetize Visual Content
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Powerful tools designed for modern content creators who want to stand out.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <SparklesIcon className="h-5 w-5 flex-none text-indigo-600" />
                  AI-Powered Creation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Generate stunning visual content with natural language. Our AI understands your ideas and creates professional Jotts instantly.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <CurrencyDollarIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Monetization Built-in
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Set up paid subscriptions, sell individual Jotts, or offer premium content. Get paid directly to your bank account.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <ChartBarIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Analytics Dashboard
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Track views, engagement, and earnings in real-time. Understand what content resonates with your audience.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Creator section */}
      <div id="creators" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for creators who want more
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you're a teacher, consultant, analyst, or creative professional,
              Jottr gives you the tools to share your expertise in a way that captivates and converts.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white p-2 ring-1 ring-gray-900/10">
                <PencilSquareIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-8 text-gray-900">
                Visual Editor
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Drag-and-drop interface to create stunning visual content. No design skills required.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white p-2 ring-1 ring-gray-900/10">
                <ShareIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-8 text-gray-900">
                Easy Sharing
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Share your Jotts anywhere - social media, websites, or embed them directly.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white p-2 ring-1 ring-gray-900/10">
                <BoltIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-8 text-gray-900">
                Lightning Fast
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Create and publish in minutes, not hours. Your audience gets instant access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start creating?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Join thousands of creators who are already sharing their knowledge visually with Jottr.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-100"
              >
                Get started free
              </Link>
              <Link to="/explore" className="text-sm font-semibold leading-6 text-white">
                See examples <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-white">jottr</span>
                <span className="text-sm text-gray-400">.io</span>
              </div>
              <p className="text-sm leading-6 text-gray-300">
                The visual content platform for modern creators.
              </p>
              <p className="text-xs text-gray-400">
                Powered by{' '}
                <a href="https://jframe.ai" className="text-indigo-400 hover:text-indigo-300">
                  JFrame
                </a>
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link to="/features" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link to="/pricing" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link to="/explore" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Explore
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Resources</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link to="/help" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <a href="https://jframe.ai/docs" className="text-sm leading-6 text-gray-300 hover:text-white">
                        API Docs
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link to="/about" className="text-sm leading-6 text-gray-300 hover:text-white">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link to="/careers" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link to="/privacy" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms" className="text-sm leading-6 text-gray-300 hover:text-white">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 Jottr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}