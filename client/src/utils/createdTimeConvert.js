export default function createdTimeConvert(createdAt) {
  // Created Time Calculations start
  const createdTime = new Date(createdAt);
  const now = new Date();

  const timeDifference = now - createdTime; // Milisecond difference between created
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  let timeAgo;

  if (weeks >= 2) {
    // If it's more than or equal to 2 weeks, show in dd.mm.yyyy format
    const day = createdTime.getDate();
    const month = createdTime.getMonth() + 1; // Months are zero-based
    const year = createdTime.getFullYear();
    timeAgo = `${day < 10 ? '0' : ''}${day}.${
      month < 10 ? '0' : ''
    }${month}.${year}`;
  } else if (weeks > 0) {
    timeAgo = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  // Created Time Calculations end

  return timeAgo;
}
