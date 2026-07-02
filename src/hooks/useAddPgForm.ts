import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Floor, Room, RoomStatus } from "@/models";
 
const API_BASE = "/api";
 
export function useAddPgForm() {
    const { data: session } = useSession();
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fullAddress, setFullAddress] = useState("");
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [rent, setRent] = useState(""); // Base/Avg rent
    const [deposit, setDeposit] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");

    // Floors and Rooms
    const [floors, setFloors] = useState<Floor[]>([]);

    const addFloor = () => {
        const nextFloorNum = floors.length > 0 ? Math.max(...floors.map(f => f.FloorNumber)) + 1 : 1;
        setFloors([...floors, { FloorNumber: nextFloorNum, Rooms: [] }]);
    };

    const removeFloor = (floorNum: number) => {
        setFloors(floors.filter(f => f.FloorNumber !== floorNum));
    };

    const addRoom = (floorNum: number) => {
        setFloors(floors.map(f => {
            if (f.FloorNumber === floorNum) {
                const newRoom: Room = {
                    RoomId: Math.random().toString(36).substr(2, 9),
                    RoomNumber: `${floorNum}${f.Rooms.length + 1}`,
                    Type: "Single",
                    Price: 0,
                    MaxCapacity: 1,
                    CurrentOccupancy: 0,
                    Status: "AVAILABLE",
                    GuestIds: []
                };
                return { ...f, Rooms: [...f.Rooms, newRoom] };
            }
            return f;
        }));
    };

    const updateRoom = (floorNum: number, roomId: string, updates: Partial<Room>) => {
        setFloors(floors.map(f => {
            if (f.FloorNumber === floorNum) {
                return {
                    ...f,
                    Rooms: f.Rooms.map(r => r.RoomId === roomId ? { ...r, ...updates } : r)
                };
            }
            return f;
        }));
    };

    const removeRoom = (floorNum: number, roomId: string) => {
        setFloors(floors.map(f => {
            if (f.FloorNumber === floorNum) {
                return { ...f, Rooms: f.Rooms.filter(r => r.RoomId !== roomId) };
            }
            return f;
        }));
    };

    const [amenities, setAmenities] = useState<string[]>([]);
    const [newAmenity, setNewAmenity] = useState("");

    const [landmarks, setLandmarks] = useState<{name: string, distance: string}[]>([]);
    const [newLandmark, setNewLandmark] = useState({ name: "", distance: "" });

    const [minMonths, setMinMonths] = useState("1");
    const [maxMonths, setMaxMonths] = useState("12");
    const [conditions, setConditions] = useState("");
    const [genderPreference, setGenderPreference] = useState("ANY");

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [googleMapsUrl, setGoogleMapsUrl] = useState("");

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toString());
                setLongitude(position.coords.longitude.toString());
                setError("");
            },
            (err) => {
                setError("Unable to retrieve location: " + err.message);
            }
        );
    };
 
    const videoFileRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 50) {
            setError("Maximum 50 images allowed");
            return;
        }
        setImages([...images, ...files]);
        setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]);
        setError("");
    };

    const removeImage = (idx: number) => {
        setImages(images.filter((_, i) => i !== idx));
        setPreviews(previews.filter((_, i) => i !== idx));
    };

    const handleVideoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (videos.length + files.length > 10) {
            setError("Maximum 10 videos allowed");
            return;
        }
        setVideos([...videos, ...files]);
        setVideoPreviews([...videoPreviews, ...files.map(f => URL.createObjectURL(f))]);
        setError("");
    };

    const removeVideo = (idx: number) => {
        setVideos(videos.filter((_, i) => i !== idx));
        setVideoPreviews(videoPreviews.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            // Upload images one by one to avoid payload limits
            let imageUrls: string[] = [];
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const img = images[i];
                    const imgFormData = new FormData();
                    imgFormData.append("files", img);
                    const uploadRes = await fetch(`${API_BASE}/upload`, {
                        method: "POST",
                        body: imgFormData
                    });
                    if (!uploadRes.ok) {
                        const errorData = await uploadRes.json().catch(() => ({}));
                        throw new Error(errorData.error || `Failed to upload image ${i + 1}: ${img.name}`);
                    }
                    const data = await uploadRes.json();
                    if (data.urls && data.urls.length > 0) {
                        imageUrls.push(...data.urls);
                    }
                }
            }

            // Upload videos one by one to avoid payload limits
            let videoUrls: string[] = [];
            if (videos.length > 0) {
                for (let i = 0; i < videos.length; i++) {
                    const vid = videos[i];
                    const vidFormData = new FormData();
                    vidFormData.append("files", vid);
                    const uploadRes = await fetch(`${API_BASE}/upload`, {
                        method: "POST",
                        body: vidFormData
                    });
                    if (!uploadRes.ok) {
                        const errorData = await uploadRes.json().catch(() => ({}));
                        throw new Error(errorData.error || `Failed to upload video ${i + 1}: ${vid.name}`);
                    }
                    const data = await uploadRes.json();
                    if (data.urls && data.urls.length > 0) {
                        videoUrls.push(...data.urls);
                    }
                }
            }

            const body = {
                OwnerId: (session?.user as any)?.id,
                Title: title,
                Description: description,
                FullAddress: fullAddress,
                City: city,
                Area: area,
                Rent: parseFloat(rent),
                SecurityDeposit: parseFloat(deposit),
                Floors: floors,
                Amenities: amenities,
                NearbyLandmarks: landmarks,
                RentAgreement: {
                    MinMonths: parseInt(minMonths),
                    MaxMonths: parseInt(maxMonths),
                    Conditions: conditions,
                },
                GenderPreference: genderPreference,
                Images: imageUrls,
                Videos: videoUrls,
                Latitude: latitude ? parseFloat(latitude) : undefined,
                Longitude: longitude ? parseFloat(longitude) : undefined,
                GoogleMapsUrl: googleMapsUrl || undefined,
                IsAcceptingGuests: true
            };

            const res = await fetch(`${API_BASE}/pg-listings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to create listing");
            }
            setSuccess(true);
            setTimeout(() => router.push("/"), 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
        setSubmitting(false);
    };

    return {
        formState: {
            title, setTitle,
            description, setDescription,
            fullAddress, setFullAddress,
            city, setCity,
            area, setArea,
            rent, setRent,
            deposit, setDeposit,
            contactPhone, setContactPhone,
            contactEmail, setContactEmail,
            floors, setFloors,
            amenities, setAmenities,
            newAmenity, setNewAmenity,
            landmarks, setLandmarks,
            newLandmark, setNewLandmark,
            minMonths, setMinMonths,
            maxMonths, setMaxMonths,
            conditions, setConditions,
            genderPreference, setGenderPreference,
            images, setImages,
            previews, setPreviews,
            videos, setVideos,
            videoPreviews, setVideoPreviews,
            latitude, setLatitude,
            longitude, setLongitude,
            googleMapsUrl, setGoogleMapsUrl,
            submitting, error, success
        },
        handlers: {
            handleFiles,
            removeImage,
            handleVideoFiles,
            removeVideo,
            handleSubmit,
            addFloor,
            removeFloor,
            addRoom,
            updateRoom,
            removeRoom,
            getCurrentLocation
        },
        refs: { fileRef, videoFileRef }
    };
}
