"use client";
import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";

import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "../../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { login } from "@/app/actions";
import { useToast } from "../ui/use-toast";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "sample@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      try {
        const loginResponse = await login(values);
        if (loginResponse.message) {
          toast({
            variant: "default",
            title: "Success!",
            description: loginResponse.message,
          });
        }
        if (loginResponse.error) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: loginResponse.error,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error.message,
          });
        }
      }
    });
  };

  return (
    <div>
      LoginForm
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            Login
          </Button>
          <Button className="w-full cursor-pointer" variant="outline">
            <FcGoogle className="w-5 h-5" />
          </Button>
          <Button className="w-full cursor-pointer" variant="link" asChild>
            <Link href="/auth/register">No account? Create account</Link>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
