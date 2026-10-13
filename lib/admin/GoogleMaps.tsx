
type GoogleMapProps = {
  embedUrl: string;
  title?: string;
};

export default function GoogleMap({
  embedUrl,
  title = "Ubicación de la sucursal",
}: GoogleMapProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl">
      <iframe
        src={embedUrl}
        title={title}
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
