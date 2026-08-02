"use client";

import { useState, useEffect, useMemo } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, HeartHandshake, LayoutDashboard, Plus, Search } from "lucide-react";
import HelpCard from "@/components/help/HelpCard";
import ConnectionProposalModal from "@/components/help/ConnectionProposalModal";

interface HelpItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function HelpBoardPage() {
  const t = useTranslations("Help");
  const router = useRouter();
  const { data: session } = useSession();
  
  const [requests, setRequests] = useState<HelpItem[]>([]);
  const [offers, setOffers] = useState<HelpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "offers">("requests");
  
  // Connection proposal modal state
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);
  const [selectedType, setSelectedType] = useState<"request" | "offer">("request");

  const isApproved = session?.user?.status === "ACTIVE";
  const isLoggedIn = !!session;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [reqRes, offRes] = await Promise.all([
          fetch("/api/help/requests"),
          fetch("/api/help/offers"),
        ]);
        
        if (reqRes.ok && offRes.ok) {
          const reqData = await reqRes.json();
          const offData = await offRes.json();
          setRequests(reqData);
          setOffers(offData);
        }
      } catch (error) {
        console.error("Failed to load help board data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter items based on search query
  const filteredRequests = useMemo(() => {
    return requests.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requests, searchQuery]);

  const filteredOffers = useMemo(() => {
    return offers.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [offers, searchQuery]);

  const handleConnectTrigger = (item: HelpItem, type: "request" | "offer") => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const handleConnectionSubmit = async (message: string) => {
    if (!selectedItem) return;

    try {
      const res = await fetch("/api/help/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedType === "request" ? selectedItem.id : undefined,
          offerId: selectedType === "offer" ? selectedItem.id : undefined,
          message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to make connection");
      }

      router.push("/help/dashboard");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to connect.");
    }
  };

  return (
    <div className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Locked screen check for registered pending users */}
      {isLoggedIn && !isApproved && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Card className="max-w-md w-full border-none shadow-xl bg-card/70 backdrop-blur-md text-center p-8">
            <CardTitle className="text-2xl font-bold mb-4">{t("lockedTitle")}</CardTitle>
            <CardDescription className="mb-6">{t("lockedDesc")}</CardDescription>
            <Button asChild>
              <Link href="/">{t("lockedCTA")}</Link>
            </Button>
          </Card>
        </div>
      )}

      {(!isLoggedIn || isApproved) && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {t("title")}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                {t("description")}
              </p>
            </div>
            {isApproved && (
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="font-semibold" asChild>
                  <Link href="/help/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t("dashboard")}
                  </Link>
                </Button>
                <Button size="sm" className="font-semibold" asChild>
                  <Link href="/help/requests/new">
                    <Plus className="mr-1.5 h-4 w-4" />
                    {t("newRequest")}
                  </Link>
                </Button>
                <Button size="sm" variant="secondary" className="font-semibold" asChild>
                  <Link href="/help/offers/new">
                    <Plus className="mr-1.5 h-4 w-4" />
                    {t("newOffer")}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Search Header */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs Board */}
          <div className="w-full">
            <div className="flex border-b border-border/30 gap-6 mb-8">
              <button
                onClick={() => setActiveTab("requests")}
                className={`pb-3 font-semibold flex items-center gap-1.5 border-b-2 text-sm transition-all duration-200 ${
                  activeTab === "requests"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Handshake className="h-4 w-4" />
                {t("requestsTab")}
              </button>
              <button
                onClick={() => setActiveTab("offers")}
                className={`pb-3 font-semibold flex items-center gap-1.5 border-b-2 text-sm transition-all duration-200 ${
                  activeTab === "offers"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <HeartHandshake className="h-4 w-4" />
                {t("offersTab")}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
                Loading board posts...
              </div>
            ) : (
              <>
                {/* Requests Tab Content */}
                {activeTab === "requests" && (
                  <div>
                    {filteredRequests.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRequests.map((item) => (
                          <HelpCard
                            key={item.id}
                            item={item}
                            type="request"
                            onConnect={() => handleConnectTrigger(item, "request")}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center border-2 border-dashed rounded-xl py-16 p-8">
                        <p className="text-muted-foreground text-sm font-medium">
                          {t("noRequests")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Offers Tab Content */}
                {activeTab === "offers" && (
                  <div>
                    {filteredOffers.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredOffers.map((item) => (
                          <HelpCard
                            key={item.id}
                            item={item}
                            type="offer"
                            onConnect={() => handleConnectTrigger(item, "offer")}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center border-2 border-dashed rounded-xl py-16 p-8">
                        <p className="text-muted-foreground text-sm font-medium">
                          {t("noOffers")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Propose Connection Modal */}
          {selectedItem && (
            <ConnectionProposalModal
              isOpen={!!selectedItem}
              onClose={() => setSelectedItem(null)}
              onSubmit={handleConnectionSubmit}
              title={selectedItem.title}
              creatorName={selectedItem.user.name || "Community Member"}
            />
          )}
        </>
      )}
    </div>
  );
}
