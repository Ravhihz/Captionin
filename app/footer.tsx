export default function Footer() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "ravhi.satria@gmail.com";
  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+62 822-1052-0690";
  const address = process.env.NEXT_PUBLIC_SUPPORT_ADDRESS || "Tangerang Selatan, Indonesia";

  return (
    <footer
      className="mt-auto border-t-2 px-6 py-6 text-center text-xs opacity-60 space-y-1"
      style={{ borderColor: "var(--color-sand)" }}
    >
      <p>Butuh bantuan? Hubungi kami:</p>
      <p>
        {email} · {phone}
      </p>
      <p>{address}</p>
    </footer>
  );
}