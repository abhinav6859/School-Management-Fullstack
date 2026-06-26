// app/(protected)/profile/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface ProfileData {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt?: string;
  isAdminView?: boolean;
  gender?: string;
  bloodType?: string;
  birthday?: string;
  sex?: string;
  grade?: { level: number };
  class?: { id: string; name: string };
  parent?: { id: string; firstName: string; lastName: string; phone: string; email: string };
  students?: { id: string; firstName: string; lastName: string; email: string; class: { name: string } }[];
}

// Step 2: Renamed from ProfilePage to ProfileContent
function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    github: "",
    website: "",
  });

  // 🚀 SPEED OPTIMIZATION: Use useCallback to prevent unnecessary re-renders
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if we have cached profile data
      const cachedProfile = localStorage.getItem("cachedProfile");
      const cacheTimestamp = localStorage.getItem("profileCacheTimestamp");
      const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
      
      // Use cache if less than 5 minutes old
      if (cachedProfile && cacheAge < 5 * 60 * 1000 && !userId) {
        const data = JSON.parse(cachedProfile);
        setProfile(data);
        setBio(data.bio || "");
        setSocialLinks({
          linkedin: data.socialLinks?.linkedin || "",
          twitter: data.socialLinks?.twitter || "",
          github: data.socialLinks?.github || "",
          website: data.socialLinks?.website || "",
        });
        setLoading(false);
        return;
      }
      
      const url = userId ? `/api/profile?userId=${userId}` : "/api/profile";
      const res = await fetch(url);
      
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch profile");
      }
      
      const data = await res.json();
      setProfile(data);
      setBio(data.bio || "");
      setSocialLinks({
        linkedin: data.socialLinks?.linkedin || "",
        twitter: data.socialLinks?.twitter || "",
        github: data.socialLinks?.github || "",
        website: data.socialLinks?.website || "",
      });
      
      // Cache profile data
      if (!userId) {
        localStorage.setItem("cachedProfile", JSON.stringify(data));
        localStorage.setItem("profileCacheTimestamp", Date.now().toString());
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile?.role === "ADMIN") {
      toast.error("Admin cannot update profile");
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, socialLinks }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      
      const updatedProfile = {
        ...profile!,
        bio: bio || undefined,
        socialLinks: Object.values(socialLinks).some(v => v) ? socialLinks : undefined,
      };
      
      setProfile(updatedProfile);
      
      // Update cache
      localStorage.setItem("cachedProfile", JSON.stringify(updatedProfile));
      localStorage.setItem("profileCacheTimestamp", Date.now().toString());
      
      // Also update userName in localStorage for Navbar
      if (updatedProfile.firstName && updatedProfile.lastName) {
        localStorage.setItem("userName", `${updatedProfile.firstName} ${updatedProfile.lastName}`);
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      
      // Only refetch if there might be other changes
      await fetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const canEdit = !profile?.isAdminView && profile?.role !== "ADMIN";

  // 🚀 SPEED OPTIMIZATION: Show cached data immediately if available
  if (loading) {
    const cachedProfile = localStorage.getItem("cachedProfile");
    if (cachedProfile && !userId) {
      const data = JSON.parse(cachedProfile);
      // Show cached data while loading
      return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="px-6 sm:px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {data.firstName?.[0] || data.username?.[0] || "U"}
                    </span>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Loading profile details...</p>
                  </div>
                </div>
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-100 rounded-xl"></div>
                  <div className="h-20 bg-gray-100 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-700">Profile Not Found</h2>
          <p className="text-gray-500 mt-2">Unable to load profile data</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasBio = profile.bio && profile.bio.trim().length > 0;
  const hasSocialLinks = profile.socialLinks && Object.values(profile.socialLinks).some(link => link && link.trim().length > 0);
  const displayName = profile?.firstName && profile?.lastName 
    ? `${profile.firstName} ${profile.lastName}`
    : profile?.username;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.isAdminView ? `${displayName}'s Profile` : "My Profile"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {profile.isAdminView ? "Viewing user profile" : "Manage your personal information"}
            </p>
          </div>
          {profile.isAdminView && (
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Alert for incomplete profile */}
        {(!hasBio || !hasSocialLinks) && canEdit && !isEditing && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-lg">⚠️</span>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800">Complete Your Profile</h4>
                <p className="text-amber-700 text-sm">
                  {!hasBio && !hasSocialLinks && "Add your bio and social links to make your profile more informative."}
                  {!hasBio && hasSocialLinks && "Add your bio to help others know more about you."}
                  {hasBio && !hasSocialLinks && "Add your social links to connect with others."}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-amber-700 text-sm font-medium hover:underline"
                >
                  Update now →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            {!isEditing && canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md hover:bg-white transition-colors text-sm font-medium text-gray-700"
              >
                ✏️ Edit Profile
              </button>
            )}
            {profile.role === "ADMIN" && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                <span className="text-sm font-medium text-purple-600">Administrator</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar & Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {profile.firstName?.[0] || profile.username[0] || "U"}
                  </span>
                </div>
                {profile.role !== "ADMIN" && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${profile.role === "ADMIN" ? "bg-purple-100 text-purple-700" : ""}
                    ${profile.role === "TEACHER" ? "bg-blue-100 text-blue-700" : ""}
                    ${profile.role === "STUDENT" ? "bg-green-100 text-green-700" : ""}
                    ${profile.role === "PARENT" ? "bg-orange-100 text-orange-700" : ""}
                  `}>
                    {profile.role}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600 text-sm flex items-center justify-center sm:justify-start gap-2">
                    <span>📧</span> {profile.email}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-2">
                    <span>📅</span> Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Rest of your existing JSX */}
            {/* Edit Form or View Mode - Keep your existing code here */}
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Your existing edit form JSX */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Write a brief description about yourself..."
                      disabled={isSaving}
                    />
                    <div className="mt-1 text-right text-xs text-gray-400">
                      {bio.length}/500 characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Links
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="url"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="LinkedIn URL"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        disabled={isSaving}
                      />
                      <input
                        type="url"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                        placeholder="Twitter URL"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        disabled={isSaving}
                      />
                      <input
                        type="url"
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                        placeholder="GitHub URL"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        disabled={isSaving}
                      />
                      <input
                        type="url"
                        value={socialLinks.website}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="Website URL"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSaving ? "Saving..." : "💾 Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setBio(profile.bio || "");
                      setSocialLinks({
                        linkedin: profile.socialLinks?.linkedin || "",
                        twitter: profile.socialLinks?.twitter || "",
                        github: profile.socialLinks?.github || "",
                        website: profile.socialLinks?.website || "",
                      });
                    }}
                    className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Profile Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>👤</span> Personal Information
                    </h3>
                    <div className="space-y-3">
                      {profile.firstName && profile.lastName && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">Full Name</div>
                          <div className="text-gray-900 font-medium">{profile.firstName} {profile.lastName}</div>
                        </div>
                      )}
                      {profile.username && !profile.firstName && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">Username</div>
                          <div className="text-gray-900 font-medium">{profile.username}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Email</div>
                        <div className="text-gray-900 font-medium">{profile.email}</div>
                      </div>
                      {profile.phone && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">Phone</div>
                          <div className="text-gray-900 font-medium">{profile.phone}</div>
                        </div>
                      )}
                      {profile.address && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">Address</div>
                          <div className="text-gray-900 font-medium">{profile.address}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role Details */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🏆</span> {profile.role} Details
                    </h3>
                    <div className="space-y-3">
                      {/* Your existing role-specific details */}
                      {profile.role === "STUDENT" && (
                        <>
                          {profile.sex && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Gender</div>
                              <div className="text-gray-900 font-medium">{profile.sex}</div>
                            </div>
                          )}
                          {profile.bloodType && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Blood Type</div>
                              <div className="text-gray-900 font-medium">{profile.bloodType}</div>
                            </div>
                          )}
                          {profile.birthday && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Birthday</div>
                              <div className="text-gray-900 font-medium">{new Date(profile.birthday).toLocaleDateString()}</div>
                            </div>
                          )}
                          {profile.grade && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Grade</div>
                              <div className="text-gray-900 font-medium">Grade {profile.grade.level}</div>
                            </div>
                          )}
                          {profile.class && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Class</div>
                              <div className="text-gray-900 font-medium">{profile.class.name}</div>
                            </div>
                          )}
                          {profile.parent && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Parent</div>
                              <div className="text-gray-900 font-medium">{profile.parent.firstName} {profile.parent.lastName}</div>
                              <div className="text-sm text-gray-600">{profile.parent.email}</div>
                            </div>
                          )}
                        </>
                      )}

                      {profile.role === "TEACHER" && (
                        <>
                          {profile.gender && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Gender</div>
                              <div className="text-gray-900 font-medium">{profile.gender}</div>
                            </div>
                          )}
                          {profile.bloodType && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Blood Type</div>
                              <div className="text-gray-900 font-medium">{profile.bloodType}</div>
                            </div>
                          )}
                          {profile.birthday && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Birthday</div>
                              <div className="text-gray-900 font-medium">{new Date(profile.birthday).toLocaleDateString()}</div>
                            </div>
                          )}
                        </>
                      )}

                      {profile.role === "PARENT" && profile.students && profile.students.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">Children</div>
                          <div className="space-y-2 mt-2">
                            {profile.students.map((student) => (
                              <div key={student.id} className="bg-white p-3 rounded-lg">
                                <div className="font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                                <div className="text-sm text-gray-600">{student.email}</div>
                                {student.class && (
                                  <div className="text-xs text-gray-500 mt-1">Class: {student.class.name}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.role === "ADMIN" && (
                        <>
                          <div className="flex items-center gap-2 text-green-600">
                            <span>✅</span> Full System Access
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Account Created</div>
                            <div className="text-gray-900 font-medium">{new Date(profile.createdAt).toLocaleDateString()}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {profile.role !== "ADMIN" && (
                  <div className="mt-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <span>📝</span> About Me
                        </h3>
                        {canEdit && !hasBio && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-500 text-sm font-medium hover:underline"
                          >
                            + Add Bio
                          </button>
                        )}
                      </div>
                      {hasBio ? (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-400">No bio added yet</p>
                          {canEdit && (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="mt-2 text-blue-500 text-sm font-medium hover:underline"
                            >
                              Add your bio now
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {profile.role !== "ADMIN" && (
                  <div className="mt-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <span>🔗</span> Social Links
                        </h3>
                        {canEdit && !hasSocialLinks && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-500 text-sm font-medium hover:underline"
                          >
                            + Add Links
                          </button>
                        )}
                      </div>
                      {hasSocialLinks ? (
                        <div className="flex flex-wrap gap-4">
                          {profile.socialLinks?.linkedin && (
                            <a
                              href={profile.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow transition text-blue-600 font-medium"
                            >
                              LinkedIn
                            </a>
                          )}
                          {profile.socialLinks?.twitter && (
                            <a
                              href={profile.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow transition text-blue-400 font-medium"
                            >
                              Twitter
                            </a>
                          )}
                          {profile.socialLinks?.github && (
                            <a
                              href={profile.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow transition text-gray-700 font-medium"
                            >
                              GitHub
                            </a>
                          )}
                          {profile.socialLinks?.website && (
                            <a
                              href={profile.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow transition text-green-600 font-medium"
                            >
                              Website
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-400">No social links added yet</p>
                          {canEdit && (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="mt-2 text-blue-500 text-sm font-medium hover:underline"
                            >
                              Add your social links now
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Default export with Suspense boundary
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}