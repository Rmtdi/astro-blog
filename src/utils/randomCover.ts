import covers from "../covers";

// simple string hash — same string always returns same index
function hashToIndex(id: string, max: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0; // convert to 32-bit int
  }
  return Math.abs(hash) % max;
}

export default (id?: string) => {
  if (!covers || covers.length === 0) return null;
  if (id) return covers[hashToIndex(id, covers.length)];
  // fallback random for places without a post id
  return covers[Math.floor(Math.random() * covers.length)];
};
