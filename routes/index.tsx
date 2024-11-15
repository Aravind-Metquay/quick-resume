import { JSX } from "preact";

export default function Home(): JSX.Element {
  return (
    <div class="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
            Craft Your Perfect Resume
          </h1>
          
          <p class="text-lg sm:text-xl text-gray-600 mb-10">
            Create a professional resume that stands out and gets you noticed.
            Simple, fast, and effective.
          </p>

          <a
            href="/create-resume"
            class="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            Get Started Now
            <svg 
              class="ml-2 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer class="absolute bottom-0 w-full bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="text-center text-white">
            Built with ❤️ by Metquay
          </div>
        </div>
      </footer>
    </div>
  );
}