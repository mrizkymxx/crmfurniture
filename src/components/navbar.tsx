'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/store/userStore'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const { user, profile, clearUser } = useUserStore()
  const { toggleSidebar } = useAppStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearUser()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm border-gray-200/50 transition-all duration-300">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2 hover:bg-blue-50 transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
        
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow" style={{background: 'linear-gradient(to bottom right, rgb(37 99 235), rgb(79 70 229))'}}>
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold" style={{background: 'linear-gradient(to right, rgb(37 99 235), rgb(79 70 229))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
            Factory MRP
          </span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <>
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, rgb(59 130 246), rgb(168 85 247))'}}>
                  <span className="text-white text-xs font-semibold">
                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{background: 'linear-gradient(to bottom right, rgb(59 130 246), rgb(168 85 247))'}}>
                      <span className="text-sm font-semibold text-white">
                        {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
