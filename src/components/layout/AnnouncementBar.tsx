const MESSAGES = [
  "Free shipping on orders over $99",
  "New arrivals dropped this week",
  "30-day free returns, no questions asked",
];
const AnnouncementBar = () => {
  return (
    <div className="overflow-hidden bg-ink py-2 text-paper">
      <div className="no-scrollbar flex w-max animate-marquee gap-16 whitespace-nowrap">
        {[...MESSAGES, ...MESSAGES].map((msg, i) => (
          <span
            key={i}
            className="label-tag flex items-center gap-16 font-medium"
          >
            {msg}
            <span aria-hidden="true" className="text-copper">
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
