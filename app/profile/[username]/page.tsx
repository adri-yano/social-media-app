// app/profile/[username]/page.tsx (Server Component)
import ProfilePage from "./ProfilePage";

export default async function ProfilePageWrapper({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <ProfilePage username={username} />;
}
