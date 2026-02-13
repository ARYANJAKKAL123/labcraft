import { FlaskConical, Moon, Sun, LogOut, User as UserIcon, Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useTheme } from '@/hooks';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-xl shadow-lg shadow-primary/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center">
        {/* Menu button for mobile */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden hover:scale-110 transition-transform"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-3 mr-4 group cursor-pointer">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-110">
            <FlaskConical className="h-5 w-5 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="hidden font-bold text-lg sm:inline-block gradient-text-animated">
              LabCraft
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block -mt-1">
              Practical Manual Manager
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl hover:bg-violet-500/10 hover:text-violet-500 transition-all duration-300 hover:scale-110"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-violet-500" />
            )}
          </Button>

          {/* User menu */}
          {isAuthenticated && user && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-xl hover:bg-violet-500/10 transition-all duration-300"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:inline font-medium">{user.email.split('@')[0]}</span>
              </Button>

              {/* Mobile user menu */}
              {showMobileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-popover/95 backdrop-blur-xl p-2 shadow-xl shadow-violet-500/10 animate-fade-in md:hidden">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border/50">
                    {user.email}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 mt-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}

              {/* Desktop logout */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-110"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
