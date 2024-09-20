/* eslint-disable curly */
function getSize({origin, size}) {
  const map = {
    p: {
      xl: '1200x928',
      md_600: '600x464',
      md_572: '572x340',
      md_448: '448x384',
      sm_286: '286x170',
      sm_242: '242x264',
      sm_224: '224x192',
      sm_154: '154x140',
      sm_192: '192x192',
      sm_124: '124x112',
      sm_121: '121x132',
      xs_96: '96x96',
      xs_77: '77x70',
      xs_62: '62x56',
      xs_36: '36x44',
      xs_18: '18x22',
    },
    s: {
      xxl: '104x104',
      xl: '84x84',
      md: '68x68',
      sm: '42x42',
      xs: '34x34',
    },
  };

  return map[origin][size];
}

// eslint-disable-next-line func-names
export default function (
  origin?: string,
  size?: string,
  id?: string,
  trySvg?: boolean,
  noFormat?: boolean,
) {
  if (size === 'original')
    return `/img/${origin}/original/${id.slice(0, 3)}/${`${id}_0`}.${
      trySvg ? 'svg' : 'jpg'
    }`;
  const currentSize = getSize({
    origin,
    size,
  });
  if (id) {
    const folder = id.slice(0, 3);
    const newId = `${id}_0`;
    if (trySvg) return `/img/${origin}/original/${folder}/${newId}.svg`;
    if (noFormat) return `/img/${origin}/original/${folder}/${newId}`;
    return `/img/${origin}/${currentSize}/${folder}/${newId}.jpg`;
  }
  return '';
}
