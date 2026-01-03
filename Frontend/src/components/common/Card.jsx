import clsx from 'clsx';

const Card = ({ children, className, padding = 'p-6', ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow duration-200',
        'hover:shadow-md',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;