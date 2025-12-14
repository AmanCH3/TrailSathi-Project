const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Replace backslashes with forward slashes for Windows paths
  const normalizedPath = path.toString().replace(/\\/g, '/');

  // Remove leading slash if present to avoid double slashes with API_BASE/ (assuming API_BASE doesn't end in slash, or we handle it)
  // Actually simplest is: if path doesn't start with /, add /
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  
  // If path is like "uploads/...", verify if we need to prepend API_BASE
  return `${API_BASE}${cleanPath}`;
};
