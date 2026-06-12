"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Section } from "@/components/portfolio/Section";
import { Container } from "@/components/portfolio/Container";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { Grid } from "@/components/portfolio/Grid";
import { PGCard } from "@/components/portfolio/PGCard";
import { StepCard } from "@/components/portfolio/StepCard";
import { FeatureItem } from "@/components/portfolio/FeatureItem";
import { AboutGallery } from "@/components/portfolio/AboutGallery";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { Footer } from "@/components/portfolio/Footer";
import { Divider } from "@/components/portfolio/Divider";
import { EmptyState } from "@/components/portfolio/EmptyState";
import { TrustBadge } from "@/components/portfolio/TrustBadge";
import { Button } from "@/components/ui/Button";
import * as Slider from "@radix-ui/react-slider";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;
  const OWNER_ID = (session?.user as any)?.id;

  // ----------------------------------------------------
  // GUEST / EXPLORER STATE & EFFECTS
  // ----------------------------------------------------
  const [pgs, setPgs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategories, setActiveCategories] = React.useState<string[]>(["All Stays"]);
  const [activeRoomType, setActiveRoomType] = React.useState("ALL");
  const [exploreBudget, setExploreBudget] = React.useState([0, 40000]);

  const handleCategoryToggle = (category: string) => {
    if (category === "All Stays") {
      setActiveCategories(["All Stays"]);
    } else {
      let updated = activeCategories.filter(c => c !== "All Stays");
      if (updated.includes(category)) {
        updated = updated.filter(c => c !== category);
      } else {
        updated = [...updated, category];
      }
      if (updated.length === 0) {
        updated = ["All Stays"];
      }
      setActiveCategories(updated);
    }
  };

  const fetchPgs = (city = "", minPrice = "", maxPrice = "", gender = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("pageSize", "6");
    if (city) params.append("city", city);
    if (gender) params.append("gender", gender);
    
    fetch(`/api/pg-listings?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          let filtered = data;
          if (minPrice) {
            const lowLimit = parseInt(minPrice);
            filtered = filtered.filter((item: any) => item.Rent >= lowLimit);
          }
          if (maxPrice) {
            const highLimit = parseInt(maxPrice);
            filtered = filtered.filter((item: any) => item.Rent <= highLimit);
          }
          
          const mapped = filtered.map((item: any) => ({
            id: item.Id,
            image: item.Images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
            name: item.Title || "Standard PG",
            location: `${item.Area || ""}, ${item.City || ""}`,
            area: item.Area || "",
            city: item.City || "",
            price: item.Rent || 0,
            tags: item.Amenities?.slice(0, 3) || ["WiFi", "AC"],
            amenities: item.Amenities || [],
            floors: item.Floors || []
          }));
          setPgs(mapped);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching PGs:", err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (role !== "PG_OWNER") {
      fetchPgs();
    }
  }, [role]);

  const handleSearch = (city: string, minPrice: string, maxPrice: string, gender: string) => {
    fetchPgs(city, minPrice, maxPrice, gender);
  };

  const displayedPgs = React.useMemo(() => {
    return pgs.filter(pg => {
      if (pg.price < exploreBudget[0] || pg.price > exploreBudget[1]) {
        return false;
      }
      if (!activeCategories.includes("All Stays")) {
        for (const cat of activeCategories) {
          if (cat === "Near Plaksha" && !pg.location.toLowerCase().includes("plaksha") && !pg.name.toLowerCase().includes("plaksha")) {
            return false;
          }
          if (cat === "Near Ashoka" && !pg.location.toLowerCase().includes("ashoka") && !pg.name.toLowerCase().includes("ashoka")) {
            return false;
          }
          if (cat === "Near Amity" && !pg.location.toLowerCase().includes("amity") && !pg.name.toLowerCase().includes("amity")) {
            return false;
          }
          if (cat === "With Food" && !pg.amenities.some((a: string) => a.toLowerCase().includes("food") || a.toLowerCase().includes("mess") || a.toLowerCase().includes("meal"))) {
            return false;
          }
        }
      }
      if (activeRoomType !== "ALL") {
        const hasMatchingRoom = pg.floors?.some((floor: any) => 
          floor.Rooms?.some((room: any) => 
            room.Type === activeRoomType && room.Status === "AVAILABLE"
          )
        );
        if (!hasMatchingRoom) return false;
      }
      return true;
    });
  }, [pgs, exploreBudget, activeCategories, activeRoomType]);

  // ----------------------------------------------------
  // OWNER DASHBOARD STATE & EFFECTS
  // ----------------------------------------------------
  const [ownerPgs, setOwnerPgs] = React.useState<any[]>([]);
  const [applications, setApplications] = React.useState<any[]>([]);
  const [selectedPgId, setSelectedPgId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>("overview");
  const [dashboardLoading, setDashboardLoading] = React.useState(false);

  const [showAddRoomModal, setShowAddRoomModal] = React.useState(false);
  const [newRoomNumber, setNewRoomNumber] = React.useState("");
  const [newRoomType, setNewRoomType] = React.useState<"Single" | "Double" | "Triple" | "Quadruple">("Single");
  const [newRoomPrice, setNewRoomPrice] = React.useState("");
  const [newRoomFloor, setNewRoomFloor] = React.useState("1");

  const [editTitle, setEditTitle] = React.useState("");
  const [editDesc, setEditDesc] = React.useState("");
  const [editAddress, setEditAddress] = React.useState("");
  const [editArea, setEditArea] = React.useState("");
  const [editCity, setEditCity] = React.useState("");
  const [editRent, setEditRent] = React.useState("");
  const [editDeposit, setEditDeposit] = React.useState("");
  const [editGender, setEditGender] = React.useState<any>("ANY");
  const [editAmenities, setEditAmenities] = React.useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = React.useState("");

  const [reviewsList, setReviewsList] = React.useState([
    { id: "rev-1", rating: 5, author: "Ananya Sharma", college: "Amity University", text: "Rooms are exceptionally clean and well ventilated. Highly recommended!", date: "2 days ago", reply: "" },
    { id: "rev-2", rating: 4, author: "Rahul Verma", college: "Amity University", text: "The PG is close to college. Food quality could be slightly improved, but overall very good.", date: "1 week ago", reply: "" }
  ]);
  const [replyInputs, setReplyInputs] = React.useState<Record<string, string>>({});

  const fetchOwnerData = async () => {
    if (!OWNER_ID) return;
    setDashboardLoading(true);
    try {
      const [pgRes, appRes] = await Promise.all([
        fetch(`/api/pg-listings?ownerId=${OWNER_ID}`),
        fetch(`/api/applications?ownerId=${OWNER_ID}`)
      ]);
      if (pgRes.ok) {
        const pgData = await pgRes.json();
        setOwnerPgs(pgData);
        if (pgData.length > 0 && !selectedPgId) {
          setSelectedPgId(pgData[0].Id);
        }
      }
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData);
      }
    } catch (err) {
      console.error("Error fetching owner data:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  React.useEffect(() => {
    if (role === "PG_OWNER") {
      fetchOwnerData();
    }
  }, [role, OWNER_ID]);

  React.useEffect(() => {
    const tabParam = searchParams.get("tab");
    setActiveTab(tabParam || "overview");
  }, [searchParams]);

  const activePg = React.useMemo(() => {
    return ownerPgs.find(p => p.Id === selectedPgId) || null;
  }, [ownerPgs, selectedPgId]);

  React.useEffect(() => {
    if (activePg) {
      setEditTitle(activePg.Title || "");
      setEditDesc(activePg.Description || "");
      setEditAddress(activePg.FullAddress || "");
      setEditArea(activePg.Area || "");
      setEditCity(activePg.City || "");
      setEditRent(String(activePg.Rent || ""));
      setEditDeposit(String(activePg.SecurityDeposit || ""));
      setEditGender(activePg.GenderPreference || "ANY");
      setEditAmenities(activePg.Amenities || []);
    }
  }, [activePg]);

  const overallStats = React.useMemo(() => {
    let totalPgs = ownerPgs.length;
    let totalRooms = 0;
    let totalBeds = 0;
    let occupiedBeds = 0;

    ownerPgs.forEach(pg => {
      pg.Floors?.forEach((f: any) => {
        f.Rooms?.forEach((r: any) => {
          totalRooms += 1;
          totalBeds += r.MaxCapacity || 0;
          occupiedBeds += r.CurrentOccupancy || 0;
        });
      });
    });

    const availableBeds = totalBeds - occupiedBeds;
    const pendingApps = applications.filter(a => a.Status === "PENDING").length;
    const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : "0";
    const monthlyEarnings = occupiedBeds * (activePg?.Rent || 8000);

    return {
      totalPgs,
      totalRooms,
      totalBeds,
      occupiedBeds,
      availableBeds,
      pendingApps,
      occupancyRate,
      monthlyEarnings
    };
  }, [ownerPgs, applications, activePg]);

  const handleApplicationAction = async (appId: string, status: "APPROVED" | "REJECTED", pgId: string, floorNumber?: number, roomId?: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status, pgId, floorNumber, roomId }),
      });
      if (res.ok) {
        await fetchOwnerData();
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPgId || !newRoomNumber || !newRoomPrice) return;
    const active = ownerPgs.find(p => p.Id === selectedPgId);
    if (!active) return;

    const newRoom: any = {
      RoomId: `room-${Date.now()}`,
      RoomNumber: newRoomNumber,
      Type: newRoomType,
      Price: parseFloat(newRoomPrice),
      MaxCapacity: newRoomType === "Single" ? 1 : newRoomType === "Double" ? 2 : newRoomType === "Triple" ? 3 : 4,
      CurrentOccupancy: 0,
      Status: "AVAILABLE",
      GuestIds: []
    };

    const floorNum = parseInt(newRoomFloor);
    let updatedFloors = [...(active.Floors || [])];
    let floorIndex = updatedFloors.findIndex(f => f.FloorNumber === floorNum);

    if (floorIndex === -1) {
      updatedFloors.push({
        FloorNumber: floorNum,
        Rooms: [newRoom]
      });
    } else {
      updatedFloors[floorIndex] = {
        ...updatedFloors[floorIndex],
        Rooms: [...updatedFloors[floorIndex].Rooms, newRoom]
      };
    }
    updatedFloors.sort((a, b) => a.FloorNumber - b.FloorNumber);

    const updatedPg = { ...active, Floors: updatedFloors };

    try {
      const res = await fetch(`/api/pg-listings/${selectedPgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPg)
      });
      if (res.ok) {
        await fetchOwnerData();
        setShowAddRoomModal(false);
        setNewRoomNumber("");
        setNewRoomPrice("");
      }
    } catch (err) {
      console.error("Add room error:", err);
    }
  };

  const handleDeleteRoom = async (floorNum: number, roomId: string) => {
    if (!selectedPgId || !activePg) return;
    if (!confirm("Are you sure you want to delete this room?")) return;

    let updatedFloors = activePg.Floors.map((f: any) => {
      if (f.FloorNumber === floorNum) {
        return {
          ...f,
          Rooms: f.Rooms.filter((r: any) => r.RoomId !== roomId)
        };
      }
      return f;
    }).filter((f: any) => f.Rooms.length > 0);

    const updatedPg = { ...activePg, Floors: updatedFloors };

    try {
      const res = await fetch(`/api/pg-listings/${selectedPgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPg)
      });
      if (res.ok) {
        await fetchOwnerData();
      }
    } catch (err) {
      console.error("Delete room error:", err);
    }
  };

  const handleUpdatePgDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPgId || !activePg) return;

    const updatedPg = {
      ...activePg,
      Title: editTitle,
      Description: editDesc,
      FullAddress: editAddress,
      Area: editArea,
      City: editCity,
      Rent: parseFloat(editRent),
      SecurityDeposit: parseFloat(editDeposit),
      GenderPreference: editGender,
      Amenities: editAmenities
    };

    try {
      const res = await fetch(`/api/pg-listings/${selectedPgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPg)
      });
      if (res.ok) {
        alert("PG details updated successfully!");
        await fetchOwnerData();
      } else {
        alert("Failed to update PG details");
      }
    } catch (err) {
      console.error("Update details error:", err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedPgId || !activePg) return;

    const currentCount = activePg.Images?.length || 0;
    if (currentCount + files.length > 15) {
      alert(`You can only have up to 15 photos. You currently have ${currentCount} photos, and are trying to upload ${files.length} more.`);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (uploadRes.ok) {
        const urls = await uploadRes.json();
        const updatedImages = [...(activePg.Images || []), ...urls];
        const updatedPg = { ...activePg, Images: updatedImages };

        const res = await fetch(`/api/pg-listings/${selectedPgId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPg)
        });
        if (res.ok) {
          await fetchOwnerData();
        }
      }
    } catch (err) {
      console.error("Photo upload error:", err);
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (!selectedPgId || !activePg || !activePg.Images) return;
    if (!confirm("Remove this image?")) return;

    const updatedImages = activePg.Images.filter((_: any, i: number) => i !== index);
    const updatedPg = { ...activePg, Images: updatedImages };

    try {
      const res = await fetch(`/api/pg-listings/${selectedPgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPg)
      });
      if (res.ok) {
        await fetchOwnerData();
      }
    } catch (err) {
      console.error("Delete photo error:", err);
    }
  };

  const handleSetCoverPhoto = async (index: number) => {
    if (!selectedPgId || !activePg || !activePg.Images) return;

    let updatedImages = [...activePg.Images];
    const [selectedImg] = updatedImages.splice(index, 1);
    updatedImages.unshift(selectedImg);

    const updatedPg = { ...activePg, Images: updatedImages };

    try {
      const res = await fetch(`/api/pg-listings/${selectedPgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPg)
      });
      if (res.ok) {
        await fetchOwnerData();
      }
    } catch (err) {
      console.error("Cover photo error:", err);
    }
  };

  const handleAddPhotoUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl || !selectedPgId || !activePg) return;

    const currentCount = activePg.Images?.length || 0;
    if (currentCount >= 15) {
      alert("You can only have up to 15 photos in total. Please delete some photos before adding new ones.");
      return;
    }

    const updatedImages = [...(activePg.Images || []), newPhotoUrl];
    const updatedPg = { ...activePg, Images: updatedImages };

    try {
      const res = await fetch(`/api/pg-listings/${selectedPgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPg)
      });
      if (res.ok) {
        setNewPhotoUrl("");
        await fetchOwnerData();
      }
    } catch (err) {
      console.error("Add URL photo error:", err);
    }
  };

  const handleReplySubmit = (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text) return;

    setReviewsList(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        return { ...rev, reply: text };
      }
      return rev;
    }));

    setReplyInputs(prev => ({ ...prev, [reviewId]: "" }));
  };

  const notificationsList = React.useMemo(() => {
    const list: any[] = [];
    applications.forEach(app => {
      if (app.Status === "PENDING") {
        list.push({
          id: app.Id,
          type: "warning",
          text: `📩 New booking request from ${app.Guest?.Name || "Student"} for ${app.RoomId ? `Room ${app.RoomId}` : "your PG"}.`,
          date: "New"
        });
      }
    });
    list.push({ id: "note-verify", type: "success", text: "⭐ Your PG profile is approved by Admin.", date: "1d ago" });
    list.push({ id: "note-welcome", type: "info", text: "🏠 Welcome to PG Connect! Let's get rooms filled.", date: "3d ago" });
    return list;
  }, [applications]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "100px" }}>
          <div style={{ width: "50px", height: "50px", border: "4px solid var(--border-light)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Syncing account...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && role === "PG_OWNER") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", display: "flex", flexDirection: "column" }}>
        <Navbar />
        
        <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 80px)" }}>
          <div style={{ 
            width: "280px", 
            background: "white", 
            borderRight: "1px solid var(--border-light)", 
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexShrink: 0
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-secondary)", padding: "16px", borderRadius: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem" }}>
                  {session.user?.name?.charAt(0).toUpperCase() || "O"}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 800, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{session.user?.name}</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, background: "var(--primary-light)", padding: "2px 8px", borderRadius: "20px", display: "inline-block", marginTop: "4px" }}>
                    PG OWNER
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { id: "overview", label: "📊 Overview" },
                  { id: "bookings", label: `📩 Booking Requests`, badge: overallStats.pendingApps },
                  { id: "rooms", label: "🛏️ Room Management" },
                  { id: "details", label: "📝 PG Details & Photos" },
                  { id: "reviews", label: "⭐ Reviews & Ratings" },
                  { id: "public", label: "👁️ View Public Profile" },
                  { id: "guide", label: "📖 How it Works" }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "public") {
                        if (activePg) {
                          window.open(`/pg/${activePg.Id}`, "_blank");
                        } else {
                          alert("No active PG listing found to view.");
                        }
                        return;
                      }
                      setActiveTab(item.id);
                      router.push(`/?tab=${item.id}`);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "none",
                      background: activeTab === item.id ? "var(--primary-light)" : "transparent",
                      color: activeTab === item.id ? "var(--primary)" : "var(--text)",
                      fontWeight: activeTab === item.id ? 700 : 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s"
                    }}
                  >
                    <span>{item.label}</span>
                    {!!item.badge && (
                      <span style={{ background: "var(--primary)", color: "white", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "20px" }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activePg && (
                <Link href={`/pg/${activePg.Id}`} target="_blank" style={{ textDecoration: "none" }}>
                  <Button fullWidth variant="outline" style={{ padding: "12px" }}>
                    👁️ View Public Page
                  </Button>
                </Link>
              )}
              <Link href="/owner/add-pg">
                <Button fullWidth variant="primary" style={{ padding: "12px" }}>
                  + List New PG
                </Button>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", padding: "8px", textAlign: "center" }}
              >
                Sign Out
              </button>
            </div>
          </div>

          <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
            {ownerPgs.length === 0 ? (
              <div style={{ background: "white", borderRadius: "24px", padding: "60px 40px", textAlign: "center", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)", marginTop: "40px" }}>
                <div style={{ fontSize: "5rem", marginBottom: "20px" }}>👋</div>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px" }}>Welcome to PG Connect, {session.user?.name}!</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 32px" }}>
                  Get started by listing your PG property. You will be able to manage rooms, upload photos, set facilities, accept student booking applications, and track real-time occupancy statistics here.
                </p>
                <Link href="/owner/add-pg">
                  <Button size="lg" shadow="lg">+ List Your First PG</Button>
                </Link>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
                  <div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-1px", color: "var(--text)" }}>
                      {activePg ? activePg.Title : "Property Dashboard"}
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                      Manage operations, bookings, and details for your PG listings.
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.5px" }}>ACTIVE PG</span>
                    <select
                      value={selectedPgId || ""}
                      onChange={(e) => setSelectedPgId(e.target.value)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "14px",
                        border: "1px solid var(--border)",
                        background: "white",
                        fontWeight: 700,
                        outline: "none",
                        color: "var(--text)",
                        fontSize: "0.95rem",
                        boxShadow: "var(--shadow-sm)",
                        cursor: "pointer"
                      }}
                    >
                      {ownerPgs.map(pg => (
                        <option key={pg.Id} value={pg.Id}>{pg.Title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {activeTab === "overview" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                      {[
                        { title: "Total Listings", val: overallStats.totalPgs, icon: "🏠", color: "var(--primary-light)", text: "var(--primary)" },
                        { title: "Total Rooms", val: overallStats.totalRooms, icon: "🏢", color: "#e8f0fe", text: "#1a73e8" },
                        { title: "Total Beds", val: overallStats.totalBeds, icon: "🛏️", color: "#fef7e0", text: "#b06000" },
                        { title: "Available Beds", val: overallStats.availableBeds, icon: "✅", color: "#e6f4ea", text: "#137333" },
                        { title: "Occupied Beds", val: overallStats.occupiedBeds, icon: "👥", color: "#f3e8ff", text: "#7e22ce" },
                        { title: "Pending Bookings", val: overallStats.pendingApps, icon: "📩", color: "#fce8e6", text: "#c5221f" }
                      ].map((card, i) => (
                        <div key={i} style={{ background: "white", padding: "24px", borderRadius: "20px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: card.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                            {card.icon}
                          </div>
                          <div>
                            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.title}</span>
                            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", marginTop: "4px" }}>{card.val}</h3>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "32px", alignItems: "start" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                        <div style={{ background: "white", padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "24px" }}>Occupancy Overview</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "24px" }}>
                            <div>
                              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total Beds</span>
                              <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>{overallStats.totalBeds}</h2>
                            </div>
                            <div>
                              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Occupied Beds</span>
                              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary)" }}>{overallStats.occupiedBeds}</h2>
                            </div>
                            <div>
                              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Available Beds</span>
                              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#137333" }}>{overallStats.availableBeds}</h2>
                            </div>
                          </div>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Occupancy Rate</span>
                              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--primary)" }}>{overallStats.occupancyRate}%</span>
                            </div>
                            <div style={{ height: "12px", background: "var(--bg-secondary)", borderRadius: "6px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${overallStats.occupancyRate}%`, background: "var(--primary)", transition: "width 0.8s ease-out" }} />
                            </div>
                          </div>
                        </div>

                        <div style={{ background: "white", padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "24px" }}>PG Performance & Analytics</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "16px" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Profile Views</span>
                              <div style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "8px" }}>142</div>
                              <span style={{ fontSize: "0.75rem", color: "#137333", fontWeight: 700 }}>📈 +14% this week</span>
                            </div>
                            <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "16px" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Monthly Earnings</span>
                              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#137333", marginTop: "8px" }}>₹{overallStats.monthlyEarnings.toLocaleString()}</div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Based on occupied beds</span>
                            </div>
                            <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "16px" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Accepted Bookings</span>
                              <div style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "8px" }}>
                                {applications.filter(a => a.Status === "APPROVED").length}
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total bookings finalized</span>
                            </div>
                            <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "16px" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Rejected Bookings</span>
                              <div style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "8px" }}>
                                {applications.filter(a => a.Status === "REJECTED").length}
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Incomplete or incompatible profiles</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                        <div style={{ background: "white", padding: "28px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "16px" }}>⚡ Quick Actions</h3>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Button variant="outline" onClick={() => { setActiveTab("rooms"); router.push("?tab=rooms"); setShowAddRoomModal(true); }}>
                              Add Room/Beds
                            </Button>
                            <Button variant="outline" onClick={() => { setActiveTab("details"); router.push("?tab=details"); }}>
                              Upload Photos
                            </Button>
                            <Button variant="outline" onClick={() => { setActiveTab("details"); router.push("?tab=details"); }}>
                              Edit Base Rent
                            </Button>
                            <Button variant="outline" onClick={() => {
                              if (activePg) {
                                const link = `${window.location.origin}/pg/${activePg.Id}`;
                                navigator.clipboard.writeText(link);
                                alert("PG Share Link copied to clipboard!");
                              }
                            }}>
                              🔗 Share PG Link
                            </Button>
                          </div>
                        </div>

                        <div style={{ background: "white", padding: "28px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            🔔 Notifications
                          </h3>
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {notificationsList.map((note) => (
                              <div key={note.id} style={{ 
                                padding: "12px", 
                                borderRadius: "12px", 
                                border: "1px solid var(--border-light)",
                                background: note.type === "warning" ? "#fffcf4" : note.type === "success" ? "#f4faf6" : "white",
                                fontSize: "0.85rem",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "8px"
                              }}>
                                <span style={{ fontWeight: 500, color: "var(--text)" }}>{note.text}</span>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{note.date}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Owner Guide Call-to-Action Card */}
                        <div style={{ background: "var(--primary-light)", padding: "28px", borderRadius: "24px", border: "1px solid rgba(var(--primary-rgb), 0.1)", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--primary)", margin: 0 }}>📖 Owner's Guide</h3>
                          <p style={{ fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.5, margin: 0 }}>
                            Need help understanding how the platform, bookings, and room allocations work? Check out our step-by-step guide.
                          </p>
                          <Button variant="primary" size="sm" onClick={() => { setActiveTab("guide"); router.push("?tab=guide"); }} style={{ alignSelf: "flex-start", marginTop: "8px" }}>
                            View Guide
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "guide" && (
                  <div style={{ background: "white", padding: "40px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px", color: "var(--text)" }}>Owner's Guide: How PG Connect Works</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "32px" }}>
                      Welcome to your property dashboard! Here is a simple walkthrough of how you can manage your PG and handle student bookings.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
                      {[
                        {
                          step: 1,
                          title: "Add & Configure Your PG",
                          desc: "Start by listing your property details, location, and uploading attractive photos. In the 'PG Details & Photos' tab, you can update base rent, select amenities (WiFi, AC, Laundry, etc.), and edit details at any time.",
                          icon: "🏢",
                          color: "var(--primary-light)"
                        },
                        {
                          step: 2,
                          title: "Manage Rooms and Beds",
                          desc: "Under 'Room Management', configure floors, rooms, and available beds (e.g. Single Sharing, Double Sharing). You can view real-time occupancy status for each room and manually mark rooms as locked if they are under maintenance.",
                          icon: "🛏️",
                          color: "#e8f0fe"
                        },
                        {
                          step: 3,
                          title: "Receive Booking Requests",
                          desc: "Students browsing the platform can submit booking applications for your PG. You will receive real-time notifications and see pending requests under the 'Booking Requests' tab.",
                          icon: "📩",
                          color: "#fce8e6"
                        },
                        {
                          step: 4,
                          title: "Approve and Assign Beds",
                          desc: "Review student profiles, preferences, and details. You can accept a booking by selecting an available room and floor to assign the student to. Once approved, the student's status is updated, and they are automatically checked in.",
                          icon: "✅",
                          color: "#e6f4ea"
                        },
                        {
                          step: 5,
                          title: "Track Occupancy & Earnings",
                          desc: "Monitor your overall occupancy rate, view total active residents, and analyze your monthly earnings directly on the 'Overview' dashboard. Keep your details updated to attract more bookings!",
                          icon: "📈",
                          color: "#fef7e0"
                        }
                      ].map((item) => (
                        <div key={item.step} style={{ display: "flex", gap: "20px", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-light)", background: "var(--bg-secondary)" }}>
                          <div style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "14px",
                            background: item.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.8rem",
                            flexShrink: 0
                          }}>
                            {item.icon}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary)", background: "var(--primary-light)", padding: "2px 8px", borderRadius: "20px" }}>
                                STEP {item.step}
                              </span>
                              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)" }}>{item.title}</h3>
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === "bookings" && (
                  <div style={{ background: "white", padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                      <div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Residency & Booking Requests</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Accept or reject student applications for your active PG.</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {applications.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                          <span style={{ fontSize: "3rem" }}>📩</span>
                          <p style={{ marginTop: "12px", fontStyle: "italic" }}>No applications received yet for this PG.</p>
                        </div>
                      ) : (
                        applications.map((app) => (
                          <div key={app.Id} style={{ 
                            padding: "24px", 
                            border: "1px solid var(--border-light)", 
                            borderRadius: "16px", 
                            background: app.Status === "PENDING" ? "#fffcf6" : "white",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: "20px",
                            alignItems: "center"
                          }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{app.Guest?.Name || "Aman Sharma"}</h3>
                                <span style={{ 
                                  fontSize: "0.75rem", 
                                  fontWeight: 700, 
                                  padding: "2px 8px", 
                                  borderRadius: "12px",
                                  background: app.Status === "PENDING" ? "#fff4e5" : app.Status === "APPROVED" ? "#e6f4ea" : "#fce8e6",
                                  color: app.Status === "PENDING" ? "#b06000" : app.Status === "APPROVED" ? "#137333" : "#c5221f"
                                }}>
                                  {app.Status}
                                </span>
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                                <div>🎓 <strong>College:</strong> {app.Guest?.College || "Amity University"}</div>
                                <div>📧 <strong>Email:</strong> {app.Guest?.Email || "aman@gmail.com"}</div>
                                <div>📞 <strong>Phone:</strong> {app.Guest?.Phone || "N/A"}</div>
                                <div>📅 <strong>Preferred Move-in:</strong> 25th June 2026</div>
                                {app.FloorNumber && app.RoomId && (
                                  <div>🛏️ <strong>Target Room:</strong> Floor {app.FloorNumber}, Room {app.RoomId.split("-").pop()}</div>
                                )}
                              </div>

                              {app.Conditions && (
                                <div style={{ background: "var(--bg-secondary)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", borderLeft: "4px solid var(--primary)" }}>
                                  💬 <strong>Special Request:</strong> "{app.Conditions}"
                                </div>
                              )}
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                              {app.Status === "PENDING" ? (
                                <>
                                  <Button variant="primary" size="sm" onClick={() => handleApplicationAction(app.Id, "APPROVED", app.PgId, app.FloorNumber, app.RoomId)}>
                                    Accept Application
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleApplicationAction(app.Id, "REJECTED", app.PgId)} style={{ color: "var(--error)", borderColor: "var(--error)" }}>
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>Action completed</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === "rooms" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    <div style={{ background: "white", padding: "28px 32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Room & Bed Configuration</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Define rooms, assign capacity type, and monitor occupancy.</p>
                      </div>
                      <Button onClick={() => setShowAddRoomModal(true)}>+ Add Room</Button>
                    </div>

                    {showAddRoomModal && (
                      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ background: "white", width: "420px", padding: "32px", borderRadius: "24px", boxShadow: "var(--shadow-md)" }}>
                          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "20px" }}>Add Room Configurations</h3>
                          <form onSubmit={handleAddRoom} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>FLOOR NUMBER</label>
                              <input 
                                type="number" 
                                value={newRoomFloor} 
                                onChange={(e) => setNewRoomFloor(e.target.value)} 
                                style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px" }} 
                                required 
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>ROOM NUMBER</label>
                              <input 
                                placeholder="e.g. 101" 
                                value={newRoomNumber} 
                                onChange={(e) => setNewRoomNumber(e.target.value)} 
                                style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px" }} 
                                required 
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>SHARING TYPE</label>
                              <select 
                                value={newRoomType} 
                                onChange={(e) => setNewRoomType(e.target.value as any)} 
                                style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px", background: "white" }}
                              >
                                <option value="Single">Single Room (1 Bed)</option>
                                <option value="Double">Double Sharing (2 Beds)</option>
                                <option value="Triple">Triple Sharing (3 Beds)</option>
                                <option value="Quadruple">Quadruple Sharing (4 Beds)</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>MONTHLY PRICE (₹)</label>
                              <input 
                                type="number" 
                                placeholder="e.g. 12000" 
                                value={newRoomPrice} 
                                onChange={(e) => setNewRoomPrice(e.target.value)} 
                                style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px" }} 
                                required 
                              />
                            </div>

                            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                              <Button type="submit" fullWidth>Save Room</Button>
                              <Button type="button" variant="outline" fullWidth onClick={() => setShowAddRoomModal(false)}>Cancel</Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    <div style={{ background: "white", padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "20px" }}>Real-Time Bed Occupancy</h3>
                      
                      {!activePg.Floors || activePg.Floors.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                          <p>No rooms configured yet. Click "+ Add Room" to define rooms for your PG listing.</p>
                        </div>
                      ) : (
                        activePg.Floors.map((floor: any) => (
                          <div key={floor.FloorNumber} style={{ marginBottom: "32px" }}>
                            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", paddingBottom: "8px", borderBottom: "1px solid var(--border-light)", marginBottom: "16px" }}>
                              🏢 Floor {floor.FloorNumber}
                            </h4>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                              {floor.Rooms?.map((room: any) => {
                                const occupied = room.CurrentOccupancy || 0;
                                const capacity = room.MaxCapacity || 0;
                                return (
                                  <div key={room.RoomId} style={{ 
                                    background: "var(--bg-secondary)", 
                                    padding: "20px", 
                                    borderRadius: "16px",
                                    border: "1px solid var(--border-light)",
                                    position: "relative"
                                  }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                      <div>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 700 }}>ROOM</span>
                                        <h4 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "2px 0 0" }}>{room.RoomNumber}</h4>
                                      </div>
                                      <span style={{ 
                                        fontSize: "0.7rem", 
                                        fontWeight: 700, 
                                        padding: "4px 10px", 
                                        borderRadius: "20px",
                                        background: room.Status === "AVAILABLE" ? "#e6f4ea" : room.Status === "FULL" ? "#fce8e6" : "#f1f3f4",
                                        color: room.Status === "AVAILABLE" ? "#137333" : room.Status === "FULL" ? "#c5221f" : "#5f6368"
                                      }}>
                                        {room.Status}
                                      </span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                                      <div>👥 <strong>Type:</strong> {room.Type}</div>
                                      <div>₹ <strong>Rent:</strong> ₹{room.Price}/mo</div>
                                    </div>
                                    <div style={{ background: "white", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <div>
                                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "4px" }}>Bed Map</div>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                          {Array.from({ length: capacity }).map((_, idx) => (
                                            <span 
                                              key={idx} 
                                              style={{ 
                                                fontSize: "1.3rem", 
                                                fontFamily: "monospace", 
                                                lineHeight: 1, 
                                                color: idx < occupied ? "var(--primary)" : "#cbd5e1" 
                                              }}
                                            >
                                              {idx < occupied ? "█" : "░"}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text)" }}>{occupied} / {capacity}</span>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Beds Filled</div>
                                      </div>
                                    </div>
                                    <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                                      <button 
                                        onClick={() => handleDeleteRoom(floor.FloorNumber, room.RoomId)}
                                        style={{ width: "100%", padding: "8px", border: "1px solid #c5221f", color: "#c5221f", background: "transparent", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                                      >
                                        Delete Room
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === "details" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", alignItems: "start" }}>
                    <div style={{ background: "white", padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "24px" }}>Property Configuration</h2>
                      <form onSubmit={handleUpdatePgDetails} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>PG NAME</label>
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px" }} required />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>DESCRIPTION</label>
                          <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px", minHeight: "80px", fontFamily: "inherit" }} required />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>FULL ADDRESS</label>
                          <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px" }} required />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>AREA</label>
                            <input value={editArea} onChange={(e) => setEditArea(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px" }} required />
                          </div>
                          <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>CITY</label>
                            <input value={editCity} onChange={(e) => setEditCity(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px" }} required />
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>BASE RENT (₹/mo)</label>
                            <input type="number" value={editRent} onChange={(e) => setEditRent(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px" }} required />
                          </div>
                          <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>SECURITY DEPOSIT (₹)</label>
                            <input type="number" value={editDeposit} onChange={(e) => setEditDeposit(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px" }} required />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>TENANT GENDER PREFERENCE</label>
                          <select 
                            value={editGender} 
                            onChange={(e) => setEditGender(e.target.value as any)} 
                            style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "10px", background: "white" }}
                          >
                            <option value="ANY">Any Gender</option>
                            <option value="MALE">Male Only</option>
                            <option value="FEMALE">Female Only</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>FACILITIES & AMENITIES</label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {["WiFi", "Air Conditioning", "Mess Food", "Power Backup", "Gym", "Washing Machine", "Security Guard", "Geyser"].map((facility) => {
                              const included = editAmenities.includes(facility);
                              return (
                                <button
                                  key={facility}
                                  type="button"
                                  onClick={() => {
                                    if (included) {
                                      setEditAmenities(prev => prev.filter(f => f !== facility));
                                    } else {
                                      setEditAmenities(prev => [...prev, facility]);
                                    }
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    border: "1px solid var(--border)",
                                    background: included ? "var(--primary-light)" : "white",
                                    color: included ? "var(--primary)" : "var(--text)",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                  }}
                                >
                                  {facility} {included ? "✓" : "+"}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <Button type="submit" style={{ marginTop: "12px" }}>Save Configurations</Button>
                      </form>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                      <div style={{ background: "white", padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "8px" }}>Photo Gallery</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px" }}>Upload, delete, and set cover photos for your PG listing.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px", marginBottom: "24px" }}>
                          {activePg.Images?.map((url: string, index: number) => (
                            <div key={index} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: 1, border: "1px solid var(--border)" }}>
                              <img src={url} alt={`PG Photo ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", opacity: 0, transition: "opacity 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "6px" }} className="photo-actions-overlay">
                                <style jsx global>{`
                                  .photo-actions-overlay:hover { opacity: 1 !important; }
                                `}</style>
                                <button 
                                  onClick={() => handleDeletePhoto(index)}
                                  style={{ background: "#c5221f", color: "white", border: "none", width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer", fontSize: "0.7rem", alignSelf: "flex-end", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  ✕
                                </button>
                                <button 
                                  onClick={() => handleSetCoverPhoto(index)}
                                  style={{ background: index === 0 ? "var(--success)" : "rgba(255,255,255,0.9)", color: index === 0 ? "white" : "black", border: "none", padding: "2px 4px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: 700, cursor: "pointer" }}
                                >
                                  {index === 0 ? "COVER" : "SET COVER"}
                                </button>
                              </div>
                              {index === 0 && (
                                <div style={{ position: "absolute", top: "6px", left: "6px", background: "rgba(0, 132, 137, 0.9)", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: 700 }}>
                                  COVER
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{ border: "2px dashed var(--border)", borderRadius: "16px", padding: "24px", textAlign: "center", position: "relative", marginBottom: "20px" }}>
                          <span style={{ fontSize: "2rem" }}>📤</span>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginTop: "8px" }}>Upload new photos</h4>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>PNG, JPG or JPEG (max limit 15 photos)</p>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} 
                          />
                        </div>
                        <Divider />
                        <form onSubmit={handleAddPhotoUrl} style={{ marginTop: "20px" }}>
                          <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>ADD PHOTO BY WEB URL</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <input 
                              placeholder="https://images.unsplash.com/... or similar" 
                              value={newPhotoUrl} 
                              onChange={(e) => setNewPhotoUrl(e.target.value)} 
                              style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "0.85rem" }} 
                            />
                            <Button type="submit" size="sm">Add Link</Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "reviews" && (
                  <div style={{ background: "white", padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                      <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "16px 24px", borderRadius: "20px", textAlign: "center" }}>
                        <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>4.3</h2>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "2px" }}>Overall Rating</div>
                      </div>
                      <div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Student Reviews & Feedback</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Listen to tenant reviews and submit replies to improve PG reputation.</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      {reviewsList.map((rev) => (
                        <div key={rev.id} style={{ padding: "20px", border: "1px solid var(--border-light)", borderRadius: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div>
                              <h4 style={{ fontWeight: 800, fontSize: "1rem" }}>{rev.author}</h4>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Tenant from {rev.college}</span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ color: "#ffb000", fontSize: "1rem" }}>{"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}</div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{rev.date}</span>
                            </div>
                          </div>
                          <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.5, marginBottom: "16px" }}>
                            "{rev.text}"
                          </p>
                          {rev.reply ? (
                            <div style={{ background: "var(--bg-secondary)", padding: "12px 16px", borderRadius: "12px", borderLeft: "4px solid var(--success)", fontSize: "0.875rem" }}>
                              <strong>Owner Response:</strong> "{rev.reply}"
                            </div>
                          ) : (
                            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                              <input 
                                placeholder="Type a reply response to student..." 
                                value={replyInputs[rev.id] || ""} 
                                onChange={(e) => setReplyInputs(prev => ({ ...prev, [rev.id]: e.target.value }))}
                                style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.85rem" }} 
                              />
                              <Button size="sm" onClick={() => handleReplySubmit(rev.id)}>Reply</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ background: "white" }}>
      <Navbar />
      <Hero onSearch={handleSearch} />
      <Section id="explore" background="secondary">
        <Container size="xl">
          <div style={{ marginBottom: "40px" }}>
            <SectionHeader 
              title="PGs Near You" 
              subtitle="Handpicked stays in your area with verified details and transparent pricing."
              align="left"
            />
          </div>
          <div style={{ 
            background: "white", 
            padding: "24px", 
            borderRadius: "24px", 
            boxShadow: "var(--shadow-sm)", 
            marginBottom: "40px",
            border: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.5px" }}>RENT RANGE</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary)" }}>₹{exploreBudget[0]} - ₹{exploreBudget[1]}</span>
              </div>
              <div style={{ padding: "0 8px" }}>
                <Slider.Root
                  style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", height: "20px", userSelect: "none", touchAction: "none" }}
                  min={0}
                  max={40000}
                  step={500}
                  value={exploreBudget}
                  onValueChange={setExploreBudget}
                >
                  <Slider.Track style={{ backgroundColor: "var(--border-light)", position: "relative", flexGrow: 1, borderRadius: "9999px", height: "4px" }}>
                    <Slider.Range style={{ position: "absolute", backgroundColor: "var(--primary)", borderRadius: "9999px", height: "100%" }} />
                  </Slider.Track>
                  <Slider.Thumb style={{ display: "block", width: "16px", height: "16px", backgroundColor: "white", border: "2px solid var(--primary)", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", borderRadius: "50%", cursor: "pointer", outline: "none" }} />
                  <Slider.Thumb style={{ display: "block", width: "16px", height: "16px", backgroundColor: "white", border: "2px solid var(--primary)", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", borderRadius: "50%", cursor: "pointer", outline: "none" }} />
                </Slider.Root>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.5px", minWidth: "120px" }}>SHARING TYPE</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { label: "All Rooms", value: "ALL" },
                    { label: "Single Room 👤", value: "Single" },
                    { label: "Double Sharing 👥", value: "Double" },
                    { label: "Triple Sharing 👥👤", value: "Triple" },
                    { label: "Quadruple Sharing 👥👥", value: "Quadruple" }
                  ].map(tab => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveRoomType(tab.value)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        background: activeRoomType === tab.value ? "var(--primary)" : "var(--bg-secondary)",
                        color: activeRoomType === tab.value ? "white" : "var(--text)",
                        border: activeRoomType === tab.value ? "none" : "1px solid var(--border-light)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.5px", minWidth: "120px" }}>NEAR CAMPUS</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["All Stays", "Near Amity", "Near Plaksha", "Near Ashoka", "With Food"].map(cat => {
                    const isActive = activeCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "20px",
                          background: isActive ? "var(--primary)" : "var(--bg-secondary)",
                          color: isActive ? "white" : "var(--text)",
                          border: isActive ? "none" : "1px solid var(--border-light)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          whiteSpace: "nowrap",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {cat}
                        {cat !== "All Stays" && (
                          <span style={{ fontSize: "0.95rem" }}>
                            {isActive ? "☑️" : "☐"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <Grid cols={3}>
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{ height: "300px", background: "var(--bg-secondary)", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
              ))
            ) : (
              displayedPgs.map((pg, i) => (
                <PGCard key={i} {...pg} />
              ))
            )}
          </Grid>
          {!loading && displayedPgs.length === 0 && (
            <div style={{ marginTop: "60px" }}>
              <EmptyState />
            </div>
          )}
        </Container>
      </Section>
      <Section id="how-it-works">
        <Container>
          <SectionHeader title="How It Works" subtitle="Simplifying your search process in three easy steps." />
          <Grid cols={3} gap={40}>
            <StepCard number={1} title="Search & Discover" description="Browse PGs based on your location, budget, and preferences." />
            <StepCard number={2} title="Compare & Choose" description="Check amenities, pricing, and reviews before deciding." />
            <StepCard number={3} title="Connect Instantly" description="Contact owners directly and finalize your stay." />
          </Grid>
        </Container>
      </Section>
      <Section background="secondary">
        <Container size="xl">
          <SectionHeader title="Why Choose Us" subtitle="Built by students, for students. We prioritize your comfort and safety." />
          <Grid cols={4} tabletCols={2}>
            <FeatureItem icon="🛡️" title="Verified Listings" description="Every PG is reviewed for authenticity and accuracy by our team." />
            <FeatureItem icon="💎" title="Transparent Pricing" description="No hidden charges or brokerage. What you see is what you pay." />
            <FeatureItem icon="⚡" title="Direct Connections" description="Talk directly to owners — no middlemen or unnecessary delays." />
            <FeatureItem icon="📍" title="Smart Discovery" description="Personalized recommendations based on walking distance to campus." />
          </Grid>
        </Container>
      </Section>
      <Section id="about">
        <Container size="xl">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "80px", alignItems: "center", width: "100%" }}>
                <AboutGallery />
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <TrustBadge label="Built for Students" />
                <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
                  Simplifying PG search <br /> one city at a time.
                </h2>
                <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  We built this platform to solve a problem we personally faced — finding a reliable PG in a new city. Traditional methods are fragmented, unverified, and time-consuming.
                </p>
                <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Our goal is to simplify this process through technology, transparency, and trust. Today, we are building a connected ecosystem where tenants and property owners interact seamlessly.
                </p>
                <div style={{ marginTop: "12px" }}>
                  <Button variant="outline">Learn More About Our Journey</Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section id="contact">
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "start" }}>
             <style jsx>{`
              @media (max-width: 1024px) {
                .contact-grid {
                  grid-template-columns: 1fr !important;
                  gap: 48px !important;
                }
              }
            `}</style>
            <div className="contact-grid" style={{ display: "contents" }}>
              <div>
                <SectionHeader 
                  title="Get in Touch" 
                  subtitle="Have questions or want to list your PG? We're here to help."
                  align="left"
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "48px", height: "48px", background: "var(--bg-secondary)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>📧</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text)" }}>Email Support</div>
                      <div style={{ color: "var(--text-secondary)" }}>support@pgxplore.com</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "48px", height: "48px", background: "var(--bg-secondary)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>📞</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text)" }}>Phone</div>
                      <div style={{ color: "var(--text-secondary)" }}>+91 98765 43210</div>
                    </div>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading...</p></div>}>
      <LandingPageContent />
    </Suspense>
  );
}
