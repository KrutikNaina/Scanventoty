import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function useQRCodeCanvas(text) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      QRCode.toCanvas(ref.current, text, { width: 180 }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [text]);

  return ref;
}
