export default function capitalize(name: string) {
  return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
}
