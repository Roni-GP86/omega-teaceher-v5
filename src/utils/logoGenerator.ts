/**
 * Utility to generate high-resolution official logos dynamically using HTML5 Canvas.
 * This guarantees sharp rendering, zero CORS network issues, and instant offline compilation.
 */

export function getTutWuriHandayaniLogo(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Background Pentagonal Shield (Segi Lima Tut Wuri Handayani)
  const centerX = 200;
  const centerY = 200;
  const radius = 170;

  ctx.fillStyle = "#1E40AF"; // Deep Royal Blue
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Gold Inner Pentagonal Border
  ctx.strokeStyle = "#F59E0B"; // Amber Gold
  ctx.lineWidth = 6;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = centerX + (radius - 12) * Math.cos(angle);
    const y = centerY + (radius - 12) * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // 2. Central Flame / Torch (Blencong Khas Pendidikan)
  ctx.fillStyle = "#FFFFFF"; // Silver White Body
  ctx.beginPath();
  ctx.moveTo(centerX - 35, centerY + 80);
  ctx.bezierCurveTo(centerX - 40, centerY, centerX - 15, centerY - 20, centerX, centerY - 50);
  ctx.bezierCurveTo(centerX + 15, centerY - 20, centerX + 40, centerY, centerX + 35, centerY + 80);
  ctx.closePath();
  ctx.fill();

  // Handle of the torch (Gold)
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(centerX - 8, centerY + 10, 16, 80);
  ctx.beginPath();
  ctx.arc(centerX, centerY + 90, 16, 0, Math.PI);
  ctx.fill();

  // Flame Radiance (Orange Red)
  ctx.fillStyle = "#EF4444"; // Vibrant Red-Orange
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 55);
  ctx.bezierCurveTo(centerX - 25, centerY - 80, centerX - 15, centerY - 110, centerX, centerY - 130);
  ctx.bezierCurveTo(centerX + 15, centerY - 110, centerX + 25, centerY - 80, centerX, centerY - 55);
  ctx.fill();

  // 3. Gold Five-Pointed Star (Bintang di Puncak)
  ctx.fillStyle = "#FBBF24"; // Bright Yellow Gold
  ctx.beginPath();
  const starY = centerY - 100;
  const starRadiusOuter = 26;
  const starRadiusInner = 11;
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const currRadius = i % 2 === 0 ? starRadiusOuter : starRadiusInner;
    const x = centerX + currRadius * Math.cos(angle);
    const y = starY + currRadius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // 4. Wrapping Text "TUT WURI HANDAYANI"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const bannerText = "TUT WURI HANDAYANI";
  const numLetters = bannerText.length;
  const arcRadius = 145;
  const startAngle = Math.PI - 0.7; // Arc bottom-to-bottom

  for (let i = 0; i < numLetters; i++) {
    const charAngle = startAngle + (i / (numLetters - 1)) * 1.4;
    const x = centerX + arcRadius * Math.cos(charAngle);
    const y = centerY + arcRadius * Math.sin(charAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(charAngle + Math.PI / 2);
    ctx.fillText(bannerText[i], 0, 0);
    ctx.restore();
  }

  // Draw small decorative gold wings (Sayap Kiri-Kanan)
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  // Left Wing
  ctx.moveTo(centerX - 70, centerY + 30);
  ctx.bezierCurveTo(centerX - 110, centerY + 20, centerX - 130, centerY + 70, centerX - 105, centerY + 80);
  ctx.bezierCurveTo(centerX - 90, centerY + 70, centerX - 80, centerY + 50, centerX - 70, centerY + 30);
  // Right Wing
  ctx.moveTo(centerX + 70, centerY + 30);
  ctx.bezierCurveTo(centerX + 110, centerY + 20, centerX + 130, centerY + 70, centerX + 105, centerY + 80);
  ctx.bezierCurveTo(centerX + 90, centerY + 70, centerX + 80, centerY + 50, centerX + 70, centerY + 30);
  ctx.fill();

  return canvas.toDataURL("image/png");
}

export function getKemenagLogo(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const centerX = 200;
  const centerY = 200;
  const radius = 170;

  // Circular Dark Green Shield
  ctx.fillStyle = "#065F46"; // Emerald Green
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Gold Double Ring
  ctx.strokeStyle = "#FBBF24";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 8, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI);
  ctx.stroke();

  // Inner shield
  ctx.fillStyle = "#047857";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 20, 0, 2 * Math.PI);
  ctx.fill();

  // Drawing Star (Bintang Segi Lima Emas)
  ctx.fillStyle = "#FBBF24";
  ctx.beginPath();
  const starY = centerY - 55;
  const starRadiusOuter = 20;
  const starRadiusInner = 9;
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const currRadius = i % 2 === 0 ? starRadiusOuter : starRadiusInner;
    const x = centerX + currRadius * Math.cos(angle);
    const y = starY + currRadius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Drawing open book in the middle
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 20);
  ctx.quadraticCurveTo(centerX - 30, centerY - 5, centerX - 55, centerY + 10);
  ctx.lineTo(centerX - 55, centerY + 45);
  ctx.quadraticCurveTo(centerX - 30, centerY + 30, centerX, centerY + 55);
  ctx.quadraticCurveTo(centerX + 30, centerY + 30, centerX + 55, centerY + 45);
  ctx.lineTo(centerX + 55, centerY + 10);
  ctx.quadraticCurveTo(centerX + 30, centerY - 5, centerX, centerY + 20);
  ctx.closePath();
  ctx.fill();

  // Book spine
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(centerX - 3, centerY + 20, 6, 35);

  // Text "IKHLAS BERAMAL"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13.5px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const bannerText = "IKHLAS BERAMAL";
  const numLetters = bannerText.length;
  const arcRadius = 110;
  const startAngle = Math.PI - 0.5;

  for (let i = 0; i < numLetters; i++) {
    const charAngle = startAngle + (i / (numLetters - 1)) * 1.0;
    const x = centerX + arcRadius * Math.cos(charAngle);
    const y = centerY + arcRadius * Math.sin(charAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(charAngle + Math.PI / 2);
    ctx.fillText(bannerText[i], 0, 0);
    ctx.restore();
  }

  // Text "KEMENTERIAN AGAMA" on outer base
  ctx.fillStyle = "#FBBF24";
  ctx.font = "bold 11px font-mono";
  const outerText = "KEMENTERIAN AGAMA REPUBLIK INDONESIA";
  const outerLetters = outerText.length;
  const outerArcRadius = 142;
  const outerStartAngle = Math.PI * 0.95;

  for (let i = 0; i < outerLetters; i++) {
    const charAngle = outerStartAngle - (i / (outerLetters - 1)) * 3.3;
    const x = centerX + outerArcRadius * Math.cos(charAngle);
    const y = centerY + outerArcRadius * Math.sin(charAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(charAngle - Math.PI / 2);
    ctx.fillText(outerText[i], 0, 0);
    ctx.restore();
  }

  return canvas.toDataURL("image/png");
}

export function getDefaultSchoolLogo(schoolName: string = "SDN FATUBAI"): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const centerX = 200;
  const centerY = 200;
  const radius = 170;

  // School Circular Crest - Royal Emerald/Teal & Gold
  ctx.fillStyle = "#064E3B"; // Extremely rich deep teal/green
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Gold thick outer border
  ctx.strokeStyle = "#D97706"; // Amber-600 gold
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 6, 0, 2 * Math.PI);
  ctx.stroke();

  // Gold thin inner border
  ctx.strokeStyle = "#FBBF24"; // Amber-400 gold
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI);
  ctx.stroke();

  // Center crest background
  ctx.fillStyle = "#0F172A"; // Dark graphite
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 19, 0, 2 * Math.PI);
  ctx.fill();

  // Center Shield Logo
  ctx.fillStyle = "#0284C7"; // Bright sky blue
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 55);
  ctx.lineTo(centerX + 40, centerY - 55);
  ctx.lineTo(centerX + 40, centerY + 10);
  ctx.quadraticCurveTo(centerX, centerY + 55, centerX, centerY + 55);
  ctx.quadraticCurveTo(centerX - 40, centerY + 10, centerX - 40, centerY + 10);
  ctx.lineTo(centerX - 40, centerY - 55);
  ctx.closePath();
  ctx.fill();

  // Gold shield border
  ctx.strokeStyle = "#FBBF24";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Book symbol in the shield
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 25);
  ctx.quadraticCurveTo(centerX - 20, centerY - 40, centerX - 30, centerY - 32);
  ctx.lineTo(centerX - 30, centerY - 2);
  ctx.quadraticCurveTo(centerX - 20, centerY - 10, centerX, centerY + 2);
  ctx.quadraticCurveTo(centerX + 20, centerY - 10, centerX + 30, centerY - 2);
  ctx.lineTo(centerX + 30, centerY - 32);
  ctx.quadraticCurveTo(centerX + 20, centerY - 40, centerX, centerY - 25);
  ctx.closePath();
  ctx.fill();

  // Torch / Flame in the center of the book
  ctx.fillStyle = "#EF4444"; // Red flame
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 36);
  ctx.bezierCurveTo(centerX - 10, centerY - 48, centerX - 6, centerY - 58, centerX, centerY - 65);
  ctx.bezierCurveTo(centerX + 6, centerY - 58, centerX + 10, centerY - 48, centerX, centerY - 36);
  ctx.fill();

  // Torch stem (Gold)
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(centerX - 3.5, centerY - 37, 7, 28);

  // Curved text "PENGABDIAN & KECERDASAN" at the bottom band
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 9.5px 'Fira Code', 'Fira Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lowerText = "PENGABDIAN * KEADILAN * KECERDASAN";
  const lowerLetters = lowerText.length;
  const lowerArcRadius = 110;
  const lowerStartAngle = Math.PI * 0.95;

  for (let i = 0; i < lowerLetters; i++) {
    const charAngle = lowerStartAngle - (i / (lowerLetters - 1)) * 3.0;
    const x = centerX + lowerArcRadius * Math.cos(charAngle);
    const y = centerY + lowerArcRadius * Math.sin(charAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(charAngle - Math.PI / 2);
    ctx.fillText(lowerText[i], 0, 0);
    ctx.restore();
  }

  // Curved text of school name at the top band
  ctx.fillStyle = "#FBBF24";
  ctx.font = "black 14px 'Inter', system-ui, sans-serif";
  const upperText = schoolName.toUpperCase() + " *";
  const upperLetters = upperText.length;
  const upperArcRadius = 142;
  const upperStartAngle = Math.PI + 0.15;

  for (let i = 0; i < upperLetters; i++) {
    const charAngle = upperStartAngle + (i / (upperLetters - 1)) * 2.85;
    const x = centerX + upperArcRadius * Math.cos(charAngle);
    const y = centerY + upperArcRadius * Math.sin(charAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(charAngle + Math.PI / 2);
    ctx.fillText(upperText[i], 0, 0);
    ctx.restore();
  }

  return canvas.toDataURL("image/png");
}

/**
 * Compresses an image file to a maximum bounding box of maxWidth x maxHeight
 * and returns it as a highly compressed Base64 PNG data URL (usually 10-30KB)
 * to prevent browser QuotaExceededError in localStorage.
 */
export function compressImage(file: File, maxWidth: number = 256, maxHeight: number = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/png");
        resolve(compressedBase64);
      };
      img.onerror = () => {
        reject(new Error("Gagal membaca gambar."));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}
