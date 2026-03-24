'use client';

export default function SimulationSlot({ children }: { children?: React.ReactNode }) {
  return (
    <div className="my-12 w-full flex justify-center">
      {children}
    </div>
  );
}
