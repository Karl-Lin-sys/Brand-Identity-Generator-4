export interface ColorSwatch {
  hex: string;
  name: string;
  usage: string;
}

export interface Typography {
  name: string;
  reason: string;
}

export interface BrandData {
  palette: ColorSwatch[];
  fonts: {
    header: Typography;
    body: Typography;
  };
  secondaryMarks: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
