import { BellRing, Check, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function HomePage() {
  return (
    //  title of the blogs
    <div className="flex justify-center items-center ">
      <div className="flex flex-col gap-8 w-[900px] pt-6">
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-bold text-gray-800">Blogs</h1>
          <div className="flex flex-row gap-2 items-center">
            <Avatar>
              <AvatarFallback>
                <User className="text-sm text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <p className="text-md font-bold text-gray-800">Mark Thurn</p>
          </div>
        </div>
        {/* grid of blogs */}
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <Link href="/path-to-redirect" passHref>
              <Card
                key={index}
                className="block transform transition-transform hover:scale-105"
              >
                <CardHeader>
                  <CardTitle>Blog one</CardTitle>
                  <CardDescription>
                    This is a short description of a blog post. It provides a
                    brief summary of the content of the blog post to give
                    readers an idea of what the post is about.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <User className="text-sm text-muted-foreground pr-1" />
                  <p className="text-sm text-muted-foreground">Author</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
