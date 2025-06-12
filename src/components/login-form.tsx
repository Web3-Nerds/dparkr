'use client'

import { Suspense } from 'react';
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from "next-auth/react"
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginFormContent({ className, ...props }: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(provider);
      console.log(`Attempting ${provider} login...`);
      
      const result = await signIn(provider, { 
        callbackUrl: '/driver',
        redirect: true 
      });
      
      console.log(`${provider} login result:`, result);
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="bg-white/5 backdrop-blur-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google or Github account</CardDescription>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              Authentication failed. Please try again.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full bg-black/30" 
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading === "google"}
                >
                  {isLoading === "google" ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {isLoading === "google" ? "Signing in..." : "Login with Google"}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full bg-black/30" 
                  onClick={() => handleSocialLogin("github")}
                  disabled={isLoading === "github"}
                >
                  {isLoading === "github" ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <svg
                      className="text-white w-4 h-4 mr-2"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 27 27"
                    >
                      <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                    </svg>
                  )}
                  {isLoading === "github" ? "Signing in..." : "Login with Github"}
                </Button>
              </div>
              
              {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"> */}
              {/*   <span className="text-muted-foreground relative z-10 px-2">Or continue with</span> */}
              {/* </div> */}
              {/**/}
              {/* <div className="grid gap-6"> */}
              {/*   <div className="grid gap-3"> */}
              {/*     <Label htmlFor="email">Email</Label> */}
              {/*     <Input id="email" type="email" placeholder="m@example.com" required /> */}
              {/*   </div> */}
              {/*   <div className="grid gap-3"> */}
              {/*     <div className="flex items-center"> */}
              {/*       <Label htmlFor="password">Password</Label> */}
              {/*       <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline"> */}
              {/*         Forgot your password? */}
              {/*       </a> */}
              {/*     </div> */}
              {/*     <Input id="password" type="password" required /> */}
              {/*   </div> */}
              {/*   <Button type="submit" className="w-full"> */}
              {/*     Login */}
              {/*   </Button> */}
              {/* </div> */}
              {/**/}
              {/* <div className="text-center text-sm"> */}
              {/*   Don&apos;t have an account?{' '} */}
              {/*   <a href="#" className="underline underline-offset-4"> */}
              {/*     Sign up */}
              {/*   </a> */}
              {/* </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-muted-foreground text-center text-xs text-balance">
        <span className="[&_a]:hover:text-primary [&_a]:underline [&_a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </span>
      </div>
    </div>
  )
}

function LoginFormFallback() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-white/5 backdrop-blur-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-900 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginFormContent className={className} {...props} />
    </Suspense>
  );
}
