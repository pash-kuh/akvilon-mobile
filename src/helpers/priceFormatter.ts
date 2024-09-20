export default function priceFormatter(val, mode = 'none') {
  if (!val) {
    return '0';
  }
  if (mode) {
    if (mode === 'ceil') {
      val = Math.ceil(val);
    }
    if (mode === 'floor') {
      val = Math.floor(val);
    }
  }

  return val.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1\u00A0');
}
