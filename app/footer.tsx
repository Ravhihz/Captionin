import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "ravhi.satria@gmail.com";
  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+62 822-1052-0690";
  const address = process.env.NEXT_PUBLIC_SUPPORT_ADDRESS || "Tangerang Selatan, Indonesia";

  return (
    <footer
      className="mt-16 border-t-2 px-6 py-8"
      style={{ borderColor: "var(--color-sand)", backgroundColor: "var(--color-sand)" }}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-2 text-center">
        <p className="font-display font-bold text-sm" style={{ color: "var(--color-ink)" }}>
          Butuh bantuan?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs" style={{ color: "var(--color-ink)", opacity: 0.75 }}>
          <span className="flex items-center gap-1.5">
            <Mail size={14} /> {email}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={14} /> {phone}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {address}
          </span>
        </div>
      </div>
    </footer>
  );
}