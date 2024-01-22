import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="w-full flex justify-center items-center flex-col min-h-screen">
      <div>
        <p>simple authentication service</p>
        <LoginButton>
          <Button>Login</Button>
        </LoginButton>
      </div>
    </main>
  );
}
