"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Handshake, HeartHandshake, Inbox, Layers, MessageSquare, Trash2, ArrowRight, Pencil } from "lucide-react";

interface HelpPost {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface ConnectionItem {
  id: string;
  requestId: string | null;
  offerId: string | null;
  initiatorId: string;
  status: string;
  message: string | null;
  createdAt: string;
  initiator: {
    id: string;
    name: string | null;
    image: string | null;
  };
  request?: {
    title: string;
    userId: string;
    status: string;
    user: { name: string | null; image: string | null };
  } | null;
  offer?: {
    title: string;
    userId: string;
    status: string;
    user: { name: string | null; image: string | null };
  } | null;
}

export default function HelpDashboardPage() {
  const t = useTranslations("Help");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/help");
    }
  }, [status, router]);

  const [myRequests, setMyRequests] = useState<HelpPost[]>([]);
  const [myOffers, setMyOffers] = useState<HelpPost[]>([]);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"connections" | "posts">("connections");
  const [editingPost, setEditingPost] = useState<{ id: string; title: string; description: string; type: "requests" | "offers" } | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const isLoggedIn = !!session;
  const isApproved = session?.user?.status === "ACTIVE";

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reqRes, offRes, connRes] = await Promise.all([
        fetch(`/api/help/requests?userId=${session?.user?.id}`),
        fetch(`/api/help/offers?userId=${session?.user?.id}`),
        fetch("/api/help/connections"),
      ]);

      if (reqRes.ok && offRes.ok && connRes.ok) {
        setMyRequests(await reqRes.json());
        setMyOffers(await offRes.json());
        setConnections(await connRes.json());
      }
    } catch (error) {
      console.error("Error loading help dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session?.user?.id]);

  if (isLoggedIn && !isApproved) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[70vh]">
        <Card className="max-w-md w-full border-none shadow-xl bg-card/70 backdrop-blur-md text-center p-8">
          <CardTitle className="text-2xl font-bold mb-4">{t("lockedTitle")}</CardTitle>
          <CardDescription className="mb-6">{t("lockedDesc")}</CardDescription>
          <Button asChild>
            <Link href="/">{t("lockedCTA")}</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setIsSubmittingEdit(true);
    try {
      const res = await fetch(`/api/help/${editingPost.type}/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingPost.title,
          description: editingPost.description,
        }),
      });
      if (res.ok) {
        setEditingPost(null);
        fetchDashboardData();
      } else {
        alert("Failed to update post.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeletePost = async (id: string, type: "requests" | "offers") => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/help/${type}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateConnection = async (connId: string, status: "ACCEPTED" | "DECLINED" | "CANCELLED") => {
    try {
      const res = await fetch(`/api/help/connections/${connId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        alert("Failed to update connection status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptConnection = async (conn: ConnectionItem) => {
    const isOfferAuthor = conn.offer && conn.offer.userId === session?.user?.id;
    let pauseOffer = false;
    if (isOfferAuthor) {
      pauseOffer = confirm("Would you like to pause your help offer? (Click Cancel to keep it open so others can still connect with it.)");
    }
    
    try {
      const res = await fetch(`/api/help/connections/${conn.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "ACCEPTED",
          pauseOffer,
        }),
      });
      if (res.ok) {
        fetchDashboardData();
      } else {
        alert("Failed to accept connection.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Divide connections into respective columns
  const incomingProposals = connections.filter((conn) => {
    const isPending = conn.status === "PENDING";
    const isRecipient =
      (conn.request && conn.request.userId === session?.user?.id && conn.initiatorId !== session?.user?.id) ||
      (conn.offer && conn.offer.userId === session?.user?.id && conn.initiatorId !== session?.user?.id);
    return isPending && isRecipient;
  });

  const outgoingProposals = connections.filter((conn) => {
    const isPending = conn.status === "PENDING";
    const isProposer = conn.initiatorId === session?.user?.id;
    return isPending && isProposer;
  });

  const activeCollaborations = connections.filter((conn) => conn.status === "ACCEPTED");
  const completedCollaborations = connections.filter((conn) => conn.status === "COMPLETED");

  const getPartnerName = (conn: ConnectionItem) => {
    const isInitiator = conn.initiatorId === session?.user?.id;
    if (isInitiator) {
      return conn.request
        ? (conn.request.user.name || "Community Member")
        : (conn.offer?.user.name || "Community Member");
    }
    return conn.initiator.name || "Community Member";
  };

  const getPartnerImage = (conn: ConnectionItem) => {
    const isInitiator = conn.initiatorId === session?.user?.id;
    if (isInitiator) {
      return conn.request ? conn.request.user.image : conn.offer?.user.image;
    }
    return conn.initiator.image;
  };

  const getConnectionTitle = (conn: ConnectionItem) => {
    if (conn.request) return conn.request.title;
    if (conn.offer) return conn.offer.title;
    return "Collaboration Post";
  };

  return (
    <div className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/help" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ways to Help
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{t("dashboard")}</h1>
        <p className="mt-2 text-muted-foreground">Manage your posted requests/offers and keep track of your matched connections.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
          Loading dashboard data...
        </div>
      ) : (
        <div className="w-full">
          <div className="flex border-b border-border/30 gap-6 mb-8">
            <button
              onClick={() => setActiveTab("connections")}
              className={`pb-3 font-semibold flex items-center gap-1.5 border-b-2 text-sm transition-all duration-200 ${
                activeTab === "connections"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Handshake className="h-4 w-4" />
              {t("connections")}
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-3 font-semibold flex items-center gap-1.5 border-b-2 text-sm transition-all duration-200 ${
                activeTab === "posts"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-4 w-4" />
              {t("myPosts")}
            </button>
          </div>

          {/* Connections Tab Content */}
          {activeTab === "connections" && (
            <div className="space-y-8">
              {/* Incoming Proposals */}
              {incomingProposals.length > 0 && (
                <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                      <Inbox className="h-5 w-5 text-primary" />
                      {t("incomingProposals")}
                    </CardTitle>
                    <CardDescription>Members offering to connect on your community posts.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 sm:p-6 sm:pt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Your Post</TableHead>
                            <TableHead>Introduction Message</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {incomingProposals.map((conn) => (
                            <TableRow key={conn.id}>
                              <TableCell className="font-semibold text-sm">
                                {getPartnerName(conn)}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate text-xs font-medium">
                                {getConnectionTitle(conn)}
                              </TableCell>
                              <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">
                                {conn.message || "No introduction message."}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    className="text-[11px] font-bold"
                                    onClick={() => handleAcceptConnection(conn)}
                                  >
                                    {t("accept")}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-[11px] font-semibold text-destructive hover:bg-destructive/15"
                                    onClick={() => handleUpdateConnection(conn.id, "DECLINED")}
                                  >
                                    {t("decline")}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Connections */}
              <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <Handshake className="h-5 w-5 text-primary" />
                    {t("activeConnections")}
                  </CardTitle>
                  <CardDescription>Collaborations currently in progress. Click to log results and outcomes.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                  {activeCollaborations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Collaborator</TableHead>
                            <TableHead>Matched Post</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeCollaborations.map((conn) => (
                            <TableRow key={conn.id}>
                              <TableCell className="font-semibold text-sm">
                                {getPartnerName(conn)}
                              </TableCell>
                              <TableCell className="max-w-[300px] truncate text-xs font-medium">
                                {getConnectionTitle(conn)}
                              </TableCell>
                              <TableCell className="text-right">
                                  <Button size="sm" variant="outline" className="text-[11px] font-semibold flex items-center gap-1.5 ml-auto" asChild>
                                    <Link href={`/help/connections/${conn.id}`}>
                                      Details
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-muted-foreground">
                      No active collaborations in progress.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Outgoing Proposals */}
              {outgoingProposals.length > 0 && (
                <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                      <Inbox className="h-5 w-5 text-muted-foreground" />
                      {t("outgoingProposals")}
                    </CardTitle>
                    <CardDescription>Proposals you sent to other community members.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 sm:p-6 sm:pt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Connecting With</TableHead>
                            <TableHead>Their Post</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {outgoingProposals.map((conn) => (
                            <TableRow key={conn.id}>
                              <TableCell className="font-semibold text-sm">
                                {getPartnerName(conn)}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate text-xs font-medium">
                                {getConnectionTitle(conn)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                                  {t("status")}: Pending
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-[11px] font-semibold text-destructive hover:bg-destructive/15"
                                  onClick={() => handleUpdateConnection(conn.id, "CANCELLED")}
                                >
                                  Cancel Proposal
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Completed Collaborations */}
              {completedCollaborations.length > 0 && (
                <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                      <Layers className="h-5 w-5 text-emerald-500" />
                      {t("completedConnections")}
                    </CardTitle>
                    <CardDescription>Past matches and collaborations that have been completed.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 sm:p-6 sm:pt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Collaborator</TableHead>
                            <TableHead>Matched Post</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedCollaborations.map((conn) => (
                            <TableRow key={conn.id}>
                              <TableCell className="font-semibold text-sm">
                                {getPartnerName(conn)}
                              </TableCell>
                              <TableCell className="max-w-[300px] truncate text-xs font-medium">
                                {getConnectionTitle(conn)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="ghost" className="text-[11px] font-semibold flex items-center gap-1.5 ml-auto hover:bg-accent" asChild>
                                  <Link href={`/help/connections/${conn.id}`}>
                                    View Outcomes
                                    <ArrowRight className="h-3 w-3" />
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* My Posts Tab Content */}
          {activeTab === "posts" && (
            <div className="space-y-8">
              {/* My Requests */}
              <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <Handshake className="h-5 w-5 text-primary" />
                    {t("myRequests")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                  {myRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myRequests.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-semibold text-sm truncate max-w-[250px]">
                                {post.title}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={post.status === "OPEN" ? "default" : "secondary"}
                                  className={`text-[10px] font-semibold uppercase ${
                                    post.status === "PAUSED"
                                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/15"
                                      : ""
                                  }`}
                                >
                                  {post.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-accent text-muted-foreground hover:text-foreground"
                                    onClick={() => setEditingPost({ id: post.id, title: post.title, description: post.description, type: "requests" })}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:bg-destructive/15"
                                    onClick={() => handleDeletePost(post.id, "requests")}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-muted-foreground">
                      You haven't posted any help requests yet.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Offers */}
              <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <HeartHandshake className="h-5 w-5 text-primary" />
                    {t("myOffers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                  {myOffers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                          <TableBody>
                            {myOffers.map((post) => (
                              <TableRow key={post.id}>
                                <TableCell className="font-semibold text-sm truncate max-w-[250px]">
                                  {post.title}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={post.status === "OPEN" ? "default" : "secondary"}
                                    className={`text-[10px] font-semibold uppercase ${
                                      post.status === "PAUSED"
                                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/15"
                                        : ""
                                    }`}
                                  >
                                    {post.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="hover:bg-accent text-muted-foreground hover:text-foreground"
                                      onClick={() => setEditingPost({ id: post.id, title: post.title, description: post.description, type: "offers" })}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-destructive hover:bg-destructive/15"
                                      onClick={() => handleDeletePost(post.id, "offers")}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-xs text-muted-foreground">
                        You haven't posted any help offers yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            {/* Edit Post Modal */}
          {editingPost && (
            <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
              <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleEditSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingPost.type === "requests" ? t("edit") + " Request" : t("edit") + " Offer"}</DialogTitle>
                    <DialogDescription className="text-xs">
                      Update the title or description of your post.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 mt-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="edit-title" className="text-xs font-semibold">{t("requestTitle")}</Label>
                      <Input
                        id="edit-title"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        required
                        disabled={isSubmittingEdit}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="edit-desc" className="text-xs font-semibold">{t("requestDesc")}</Label>
                      <Textarea
                        id="edit-desc"
                        value={editingPost.description}
                        onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                        rows={5}
                        required
                        className="resize-none"
                        disabled={isSubmittingEdit}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setEditingPost(null)}
                      disabled={isSubmittingEdit}
                      className="text-xs font-semibold"
                    >
                      {t("proposeCancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmittingEdit}
                      className="text-xs font-bold"
                    >
                      {isSubmittingEdit ? "Saving..." : t("save")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
