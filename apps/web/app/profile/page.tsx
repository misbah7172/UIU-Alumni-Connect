"use client";

import { FileUp, Github, ImageUp, Linkedin, MapPin, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useUsers";
import { uploadProfileAsset } from "@/lib/uploads";
import { useState } from "react";

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(kind: "avatar" | "resume", file?: File) {
    if (!user || !file) return;

    setUploadError("");
    setIsUploading(true);

    try {
      const url = await uploadProfileAsset(kind, user.id, file);
      await updateProfile.mutateAsync(kind === "avatar" ? { profileImage: url } : { resumeUrl: url });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <main className="page-shell py-10">
          <div className="text-center">Loading profile...</div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main className="page-shell py-10">
          <div className="text-center">No user logged in</div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-10">
        <Card>
          <CardContent className="grid gap-6 pt-6 md:grid-cols-[180px_1fr_auto]">
            <div className="relative h-36 w-36 overflow-hidden rounded-lg bg-primary text-primary-foreground">
              {user.profileImage ? (
                <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-5xl font-bold">{user.name?.charAt(0)}</div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                {user.verified && (
                  <Badge className="bg-success/10 text-success">
                    <ShieldCheck size={14} />
                    Verified alumni
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-lg text-muted-foreground">{user.role}</p>
              {(user.department || user.batch) && (
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  {user.batch} · {user.department}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {user.skills?.map((skill: string) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 md:flex-col">
              <Button asChild disabled={isUploading}>
                <label>
                  <ImageUp size={17} />
                  Avatar
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => handleUpload("avatar", event.target.files?.[0])}
                  />
                </label>
              </Button>
              <Button asChild variant="outline" disabled={isUploading}>
                <label>
                  <FileUp size={17} />
                  Resume
                  <input
                    className="sr-only"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => handleUpload("resume", event.target.files?.[0])}
                  />
                </label>
              </Button>
              {user.linkedinUrl && (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <Linkedin size={17} />
                    LinkedIn
                  </Button>
                </a>
              )}
              {user.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <Github size={17} />
                    GitHub
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Bio</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{user.bio || "No bio added yet"}</p>
              {uploadError ? <p className="mt-4 text-sm font-semibold text-destructive">{uploadError}</p> : null}
              {user.studentProfile?.resumeUrl ? (
                <a
                  className="mt-4 inline-flex text-sm font-semibold text-primary"
                  href={user.studentProfile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View uploaded resume
                </a>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Statistics</h2>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Reputation Points</p>
                <p className="text-2xl font-bold text-primary">{user.reputationPoints}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
