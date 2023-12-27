"use client";

import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { Plus } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
};

const ImageUpload = ({ onChange, value, disabled = false }: ImageUploadProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
        onUpload={(result: any) => (disabled ? null : onChange(String(result?.info?.secure_url)))}
        options={{
          maxFiles: 1,
          folder: "ai-companion",
        }}
        uploadPreset="ydv3cl1c"
      >
        <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 translate-x-0 flex flex-col space-y-2 items-center justify-center">
          <div className="relative h-40 w-40">
            <Image fill alt="Upload" src={value || "/placeholder.svg"} className="rounded-lg object-cover" />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;
