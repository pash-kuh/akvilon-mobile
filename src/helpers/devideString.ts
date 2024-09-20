export default function devideString(string: string) {
  const res =
    string.slice(0, 3) + '-' + string.slice(3, 6) + '-' + string.slice(6, 10);
  return res;
}
