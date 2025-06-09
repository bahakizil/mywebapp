export function AnimatedGradient() {
  return (
    <div className="fixed inset-0 -z-20">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 50% 120%, hsl(var(--primary) / 0.08), transparent),
            radial-gradient(ellipse 600px 300px at 80% 0%, hsl(var(--primary) / 0.05), transparent)
          `,
        }}
      />
    </div>
  );
} 