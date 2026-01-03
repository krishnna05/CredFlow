export const getStatusColor = (status) => {
  const normalized = status?.toUpperCase() || 'DEFAULT';

  switch (normalized) {
    case 'HIGH':
    case 'REJECTED':
    case 'OVERDUE':
    case 'FRAUD':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'text-red-500'
      };

    case 'MEDIUM':
    case 'PENDING':
    case 'UNDER_REVIEW':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: 'text-orange-500'
      };

    case 'LOW':
    case 'APPROVED':
    case 'PAID':
    case 'COMPLETED':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'text-green-500'
      };

    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: 'text-gray-500'
      };
  }
};