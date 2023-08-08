import './Skeleton.css';

export const Skeleton = () => {
  return (
    <div className="skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-content">
        <div className="skeleton-author" />
        <div className="skeleton-description" />
      </div>
    </div>
  );
};
