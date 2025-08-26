import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { createOrUpdateUser } from "@/utils/db/actions";
import { usePrivy } from "@privy-io/react-auth";
import { LogIn, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);

  useEffect(() => {
    if (authenticated && user) {
      handleUserAuthenticated();
    }
  }, [authenticated, user]);

  useEffect(() => {
    const hasClosedModal = localStorage.getItem("emailConfirmModalClosed");
    if (!hasClosedModal && authenticated) {
      setShowEmailConfirmModal(true);
    }
  }, [authenticated]);
  const handleUserAuthenticated = async () => {
    if (user && user.wallet?.address) {
      try {
        await createOrUpdateUser(
          user.wallet.address,
          user.email?.address || ""
        );
        const hasClosedModal = localStorage.getItem("emailConfirmModalClosed");
        if (!hasClosedModal) {
          setShowEmailConfirmModal(true);
        }
      } catch (error) {
        console.error("Error updating user information:", error);
      }
    }
  };

  const handleAuth = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  const handleCloseModal = () => {
    setShowEmailConfirmModal(false);
    localStorage.setItem("emailConfirmModalClosed", "true");
  };

  return (
    <>
      <nav className="flex justify-between items-center mb-1 py-2 pt-4 px-4 md:px-8 lg:px-16">
        <Link href="/" className="flex items-center">
          <Image
            src="/svg/lock-square-rounded.svg"
            alt="web3deployer logo"
            width={40}
            height={40}
            priority
          />
          <span className="ml-2 text-xl font-bold">web3deployer</span>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="text-foreground hover:text-primary"
          >
            Dashboard
          </Link>
          <Link href="/search" className="text-foreground hover:text-primary">
            Search
          </Link>
          <Link href="/docs" className="text-foreground hover:text-primary">
            Docs
          </Link>
          <Button onClick={handleAuth} variant="outline">
            {authenticated ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
          {authenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="#">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#">Help & Support</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ModeToggle />
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/search"
                className="text-foreground hover:text-primary"
              >
                Search
              </Link>
              <Link href="/docs" className="text-foreground hover:text-primary">
                Docs
              </Link>
              <Button onClick={handleAuth} variant="outline" className="w-full">
                {authenticated ? "Logout" : "Login"}
              </Button>
              {authenticated && (
                <>
                  <Link
                    href="/profile"
                    className="text-foreground hover:text-primary"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="text-foreground hover:text-primary"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/help"
                    className="text-foreground hover:text-primary"
                  >
                    Help & Support
                  </Link>
                </>
              )}
              <ModeToggle />
            </div>
          </div>
        )}
      </nav>

      <Dialog
        open={showEmailConfirmModal}
        onOpenChange={setShowEmailConfirmModal}
      >
        <DialogContent
          className={cn(
            "bg-black",
            "shadow-lg",
            "border border-border",
            "p-6",
            "max-w-md",
            "mx-auto"
          )}
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-center">
              Confirm Your Email
            </DialogTitle>
            <DialogDescription className="text-center">
              To enable website uploads and access all features:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Check your email inbox</li>
              <li>Find the confirmation email from Web3 Storage</li>
              <li>Click the verification link in the email</li>
            </ol>
            <p className="text-sm text-muted-foreground italic">
              Note: If you've already verified your email, you can close this
              modal.
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleCloseModal}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
