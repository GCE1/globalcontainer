interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 shimmer" />
    </div>
  );
}