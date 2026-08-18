import QRCode from 'qrcode';

export async function generateQrPngDataUrl(
  text: string,
  options?: { width?: number; margin?: number; darkColor?: string; lightColor?: string }
): Promise<string> {
  const width = options?.width || 512;
  const margin = options?.margin || 2;
  const darkColor = options?.darkColor || '#000000';
  const lightColor = options?.lightColor || '#ffffff';

  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}

export async function generateQrSvgString(
  text: string,
  options?: { margin?: number; darkColor?: string; lightColor?: string }
): Promise<string> {
  const margin = options?.margin || 2;
  const darkColor = options?.darkColor || '#000000';
  const lightColor = options?.lightColor || '#ffffff';

  return QRCode.toString(text, {
    errorCorrectionLevel: 'H',
    type: 'svg',
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}
