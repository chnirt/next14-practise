import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inter, grapeNuts } from "@/styles/fonts";

export default function Home() {
  return (
    <main className="w-full flex justify-center items-center flex-col min-h-screen">
      <div className={grapeNuts.className}>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button>Login</Button>
      </div>
    </main>
  );
}
