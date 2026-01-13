import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMonitor, FiSmartphone, FiLogOut, FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SessionInfo {
  browser: string;
  os: string;
  device: string;
  createdAt: string;
  lastRefreshed: string;
  expiresAt: string;
  isCurrent: boolean;
}

const SessionManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, loading } = useAuth();
  const [currentSession, setCurrentSession] = useState<SessionInfo | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (session) {
      const userAgent = navigator.userAgent;
      const browser = getBrowserInfo(userAgent);
      const os = getOSInfo(userAgent);
      const device = getDeviceType(userAgent);

      setCurrentSession({
        browser,
        os,
        device,
        createdAt: new Date(session.user?.created_at || Date.now()).toLocaleString(),
        lastRefreshed: new Date().toLocaleString(),
        expiresAt: session.expires_at 
          ? new Date(session.expires_at * 1000).toLocaleString() 
          : "Unknown",
        isCurrent: true,
      });
    }
  }, [session]);

  const getBrowserInfo = (ua: string): string => {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("SamsungBrowser")) return "Samsung Browser";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    if (ua.includes("Trident")) return "Internet Explorer";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("Edg")) return "Edge (Chromium)";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown Browser";
  };

  const getOSInfo = (ua: string): string => {
    if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS X")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown OS";
  };

  const getDeviceType = (ua: string): string => {
    if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
      return "mobile";
    }
    if (ua.includes("Tablet") || ua.includes("iPad")) {
      return "tablet";
    }
    return "desktop";
  };

  const handleSignOutOthers = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "others" });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All other sessions have been signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out other sessions.",
        variant: "destructive",
      });
    } finally {
      setSigningOut(false);
    }
  };

  const handleSignOutAll = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" });
      
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out from all devices.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out.",
        variant: "destructive",
      });
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile/edit")}
          >
            <FiArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Session Management</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
        {/* Current Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentSession?.device === "mobile" ? (
                <FiSmartphone className="h-5 w-5" />
              ) : (
                <FiMonitor className="h-5 w-5" />
              )}
              Current Session
            </CardTitle>
            <CardDescription>
              This is your currently active session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSession && (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Browser</span>
                  <span className="font-medium">{currentSession.browser}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Operating System</span>
                  <span className="font-medium">{currentSession.os}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Device Type</span>
                  <span className="font-medium capitalize">{currentSession.device}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Account Created</span>
                  <span className="font-medium text-sm">{currentSession.createdAt}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Session Expires</span>
                  <span className="font-medium text-sm">{currentSession.expiresAt}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg mt-4">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Active now</span>
            </div>
          </CardContent>
        </Card>

        {/* Session Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Session Actions</CardTitle>
            <CardDescription>
              Manage your active sessions across devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  disabled={signingOut}
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out other devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign out other devices?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will sign out all other active sessions except your current one. 
                    Other devices will need to sign in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSignOutOthers}>
                    Sign out others
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-3"
                  disabled={signingOut}
                >
                  <FiAlertTriangle className="h-4 w-4" />
                  Sign out all devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign out everywhere?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will sign out all active sessions including this one. 
                    You will need to sign in again on all devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleSignOutAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sign out everywhere
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Sign out from devices you no longer use</li>
              <li>• If you notice unfamiliar sessions, sign out all devices and change your password</li>
              <li>• Use a strong, unique password for your account</li>
              <li>• Never share your login credentials with others</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionManagementPage;
