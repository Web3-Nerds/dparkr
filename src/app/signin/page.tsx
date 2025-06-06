import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Image src="/icons/web-app-manifest-192x192.png" alt="Dparker" width={50} height={50} />
          </div>
          {/* Dparkr */}
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
