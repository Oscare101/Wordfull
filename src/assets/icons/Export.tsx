export default function Export(color: string) {
  return `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M320 367.79H396C451 367.79 496 338.58 496 284.19C496 229.8 443 202.72 400 200.59C391.11 115.53 329 63.79 256 63.79C187 63.79 142.56 109.58 128 154.99C68 160.69 16 198.87 16 261.39C16 323.91 70 367.79 136 367.79H192" stroke="${color}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M320 255.79L256 191.79L192 255.79M256 448.21V207.79" stroke="${color}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
}
