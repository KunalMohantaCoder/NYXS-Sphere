export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-nx-bg relative overflow-hidden">
      <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-nx-purple/10 blur-3xl" style={{ animation: 'bgShift 12s ease-in-out infinite', backgroundSize: '200% 200%' }} />
      <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-nx-pink/8 blur-3xl" style={{ animation: 'bgShift 15s ease-in-out infinite reverse', backgroundSize: '200% 200%' }} />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
        {children}
      </div>
    </div>
  );
}