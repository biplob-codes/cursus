import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  image?: string | null;
  size?: "sm" | "lg";
  className?: string;
};

export function UserAvatar({
  name,
  image,
  size = "sm",
  className,
}: UserAvatarProps) {
  const sizeClass = size === "lg" ? "h-16 w-16 text-xl" : "h-5 w-5 text-[11px]";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn(
          "shrink-0 rounded-full object-cover",
          sizeClass,
          className,
        )}
        referrerPolicy="no-referrer"
      />
    );
  }

  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        sizeClass,
        className,
      )}
    >
      {initial}
    </div>
  );
}
