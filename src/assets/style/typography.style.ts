const $typographyVariable = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 29,
  xxxxl: 35,
};

const $lineHeightVariable = {
  xs: 16,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 24,
  '2xl': 28,
  '3xl': 36,
  '4xl': 40,
};

const $weightVariable = {
  light: 'PTRootUI-Light',
  regular: 'PTRootUI-Regular',
  medium: 'PTRootUI-Medium',
  bold: 'PTRootUI-Bold',
};

type TypegraphyVariableStrings = keyof typeof $typographyVariable;
type LineHeightVariableStrings = keyof typeof $lineHeightVariable;
type WeightVariableString = keyof typeof $weightVariable;

export const typography = (
  $size: TypegraphyVariableStrings | LineHeightVariableStrings = 'md',
  $weight: WeightVariableString = 'regular',
) => {
  return {
    fontFamily: $weightVariable[$weight],
    fontSize: $typographyVariable[$size],
    lineHeight: $lineHeightVariable[$size],
    letterSpacing: 0,
    color: '#000',
  };
};

export const icon = ($size: number) => {
  return {
    fontFamily: 'akvolin',
    fontSize: $size,
    color: '#000',
    height: 24,
  };
};
