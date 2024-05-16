"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useState } from "react";

// Define a schema for the form
const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Infer the type of the form data from the schema
type FormData = z.infer<typeof FormSchema>;

// Create a form component
export default function FormPage() {
  // Create a form instance
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const [clicked, setClicked] = useState<boolean>(false);

  // Define a submit handler
  const onSubmit = async (data: FormData) => {
    console.log("Submitting form", data);

    const { email: email, password } = data;

    try {
      setClicked(true);
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setClicked(false);
      if (response?.error) {
        throw new Error(response.error);
      }

      console.log("Registration Successful", response);
      router.push("/");
    } catch (error: any) {
      console.error("Registration Failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Render the form
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email and password to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="loginForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
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
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end flex-col">
        <Button
          form="loginForm"
          type="submit"
          className="w-full"
          disabled={clicked}
        >
          Sign In
        </Button>
        <div className="mt-4 text-center text-sm">
          Don't have an account? &nbsp;
          <Link className="underline" href="/register">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
